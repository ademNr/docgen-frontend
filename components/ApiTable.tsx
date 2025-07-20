import React from 'react';
import { ApiEndpoint } from '../types/documentation';

interface ApiTableProps {
    api: ApiEndpoint[];
}

const ApiTable: React.FC<ApiTableProps> = ({ api }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Endpoint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {api.map((endpoint, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                                {endpoint.endpoint}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                                        endpoint.method === 'POST' ? 'bg-yellow-100 text-yellow-800' :
                                            endpoint.method === 'PUT' ? 'bg-blue-100 text-blue-800' :
                                                endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {endpoint.method}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {endpoint.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApiTable;