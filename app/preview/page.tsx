"use client"

import type React from "react"
import { useState, Suspense, useCallback, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useSearchParams, useRouter } from "next/navigation"
import ProtectedRoute from "../../components/preview/ProtectedRoute"
import { useDocumentation } from "@/hooks/useDocumentation"
import { useParticleAnimation } from "@/hooks/useParticleAnimation"
import { generateMarkdown } from "@/utils/markdownUtils"
import saveAs from "file-saver"

import DocumentationHeader from "@/components/preview/DocumentationHeader"
import ErrorView from "@/components/error/ErrorView"
import DocumentationView from "@/components/preview/DocumentationView"
import CopyToast from "@/components/toast/CopyToast"
import NoDocumentationView from "@/components/preview/NoDocumentationView"
import type { ParticlesArray } from "@/types/particle"
import NoCreditsView from "@/components/credit/NoCreditsView"
import { useReposData } from "@/hooks/useReposData"
import LoadingComponent from "@/components/preview/PreviewLoadingComponent"

function PreviewPageContent() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [activeTab, setActiveTab] = useState<string>("readme")
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const { token, userId } = useAuth()
    const searchParams = useSearchParams()
    const repoFullName = searchParams.get("repo")

    const { credits, isSubscribedLifeTime, loading: loadingSubscription } = useReposData()
    const canPerformActions = isSubscribedLifeTime || credits > 1

    const { documentation, loading, error, progress, statusMessage, creditsError } = useDocumentation(
        token,
        userId,
        repoFullName,
    )

    const { canvasRef, particles } = useParticleAnimation()

    const handleActionCheck = useCallback(() => {
        if (!canPerformActions && !loadingSubscription) {
            router.push("/payment")
            return false
        }
        return true
    }, [canPerformActions, loadingSubscription, router])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        })
    }, [])

    const handleCopy = useCallback(async () => {
        if (!documentation || !handleActionCheck()) return

        try {
            await navigator.clipboard.writeText(generateMarkdown(documentation))
            setCopied(true)
            setCopySuccess(true)
            setTimeout(() => {
                setCopied(false)
                setCopySuccess(false)
            }, 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
            const textArea = document.createElement("textarea")
            textArea.value = generateMarkdown(documentation)
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
            setCopied(true)
            setCopySuccess(true)
            setTimeout(() => {
                setCopied(false)
                setCopySuccess(false)
            }, 2000)
        }
    }, [documentation, handleActionCheck])

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const downloadMarkdown = useCallback(() => {
        if (!documentation || !handleActionCheck()) return

        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        setDownloadProgress(0)
        let progress = 0
        intervalRef.current = setInterval(() => {
            progress += 5
            if (progress >= 100) {
                setDownloadProgress(100)
                clearInterval(intervalRef.current!)
                const blob = new Blob([generateMarkdown(documentation)], {
                    type: "text/markdown;charset=utf-8",
                })
                saveAs(blob, "README.md")
                setTimeout(() => setDownloadProgress(0), 300)
            } else {
                setDownloadProgress(progress)
            }
        }, 30)
    }, [documentation, handleActionCheck])

    if (loading || loadingSubscription)
        return <LoadingComponent repoFullName={repoFullName} statusMessage={statusMessage} progress={progress} />

    if (creditsError) return <NoCreditsView />
    if (error) return <ErrorView error={error} />

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" onMouseMove={handleMouseMove}>




            <DocumentationHeader
                repoFullName={repoFullName}
                copySuccess={copySuccess}
                downloadProgress={downloadProgress}
                onCopy={handleCopy}
                onDownload={downloadMarkdown}
            />

            <main className="relative z-20 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {documentation ? (
                        <DocumentationView documentation={documentation} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ) : (
                        <NoDocumentationView />
                    )}
                </div>
            </main>

            {copied && <CopyToast />}
        </div>
    )
}

const PreviewPage = () => {
    return (
        <ProtectedRoute>
            <Suspense
                fallback={
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <div className="text-gray-900 dark:text-white text-lg font-medium">Loading repository information...</div>
                        </div>
                    </div>
                }
            >
                <PreviewPageContent />
            </Suspense>
        </ProtectedRoute>
    )
}

export default PreviewPage
