import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface OpenAITestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

const OpenAITester: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [prompt, setPrompt] = useState('Hello, this is a test message.');
  const [results, setResults] = useState<OpenAITestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = useCallback((result: OpenAITestResult) => {
    setResults(prev => [...prev, result]);
  }, []);

  const testConnection = useCallback(async () => {
    if (!apiKey.trim()) {
      addResult({
        success: false,
        message: 'API Key Test',
        error: 'Please provide an OpenAI API key'
      });
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        addResult({
          success: false,
          message: 'API Key Test',
          error: `HTTP ${response.status}: ${errorData?.error?.message || response.statusText}`
        });
        return;
      }

      const data = await response.json();
      addResult({
        success: true,
        message: 'API Key Test',
        data: `Found ${data.data.length} available models`
      });
    } catch (error) {
      addResult({
        success: false,
        message: 'API Key Test',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [apiKey, addResult]);

  const testChatCompletion = useCallback(async () => {
    if (!apiKey.trim()) {
      addResult({
        success: false,
        message: 'Chat Completion Test',
        error: 'Please provide an OpenAI API key'
      });
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 50
        })
      });

      const data = await response.json();

      if (!response.ok) {
        addResult({
          success: false,
          message: 'Chat Completion Test',
          error: `HTTP ${response.status}: ${data?.error?.message || response.statusText}`
        });
        return;
      }

      // This is where the n8n error would occur - test for undefined properties
      if (!data) {
        addResult({
          success: false,
          message: 'Chat Completion Test',
          error: 'Received undefined response (this would cause the n8n error)'
        });
        return;
      }

      if (!data.choices || !Array.isArray(data.choices)) {
        addResult({
          success: false,
          message: 'Chat Completion Test',
          error: 'Response missing choices array (this would cause the n8n error)'
        });
        return;
      }

      addResult({
        success: true,
        message: 'Chat Completion Test',
        data: {
          model: data.model,
          choices: data.choices.length,
          usage: data.usage,
          response: data.choices[0]?.message?.content || 'No content'
        }
      });
    } catch (error) {
      addResult({
        success: false,
        message: 'Chat Completion Test',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [apiKey, model, prompt, addResult]);

  const simulateN8NError = useCallback(() => {
    // Simulate the exact n8n error scenario
    try {
      const undefinedResponse: any = undefined;
      // This would cause the error: Cannot read properties of undefined (reading 'error')
      console.log(undefinedResponse.error);
    } catch (error) {
      addResult({
        success: false,
        message: 'N8N Error Simulation',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Show the proper way to handle it
    const undefinedResponse: any = undefined;
    const safeErrorAccess = (response: any) => {
      if (response && typeof response === 'object' && 'error' in response) {
        return response.error;
      }
      return null;
    };

    const errorValue = safeErrorAccess(undefinedResponse);
    addResult({
      success: true,
      message: 'Safe Error Access',
      data: `Error value: ${errorValue} (null means no error property found)`
    });
  }, [addResult]);

  const runAllTests = useCallback(async () => {
    setLoading(true);
    setResults([]);
    
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    await testChatCompletion();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    simulateN8NError();
    
    setLoading(false);
  }, [testConnection, testChatCompletion, simulateN8NError]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Tester</CardTitle>
          <CardDescription>
            Test your OpenAI API configuration and debug n8n-style errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              OpenAI API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">
              Model
            </label>
            <Input
              id="model"
              placeholder="gpt-3.5-turbo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Test Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter a test prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={testConnection} disabled={loading}>
              Test Connection
            </Button>
            <Button onClick={testChatCompletion} disabled={loading}>
              Test Chat Completion
            </Button>
            <Button onClick={simulateN8NError} disabled={loading}>
              Simulate N8N Error
            </Button>
            <Button onClick={runAllTests} disabled={loading} variant="default">
              Run All Tests
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Alert key={index} className={result.success ? 'border-green-200' : 'border-red-200'}>
                  <div className="flex items-start gap-2">
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? 'Success' : 'Error'}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium">{result.message}</div>
                      <AlertDescription>
                        {result.success ? (
                          <div>
                            {typeof result.data === 'string' ? (
                              result.data
                            ) : (
                              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        ) : (
                          <div className="text-red-600">{result.error}</div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>N8N Error Fix Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Common Solutions:</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Verify your OpenAI API key is correct and has proper permissions</li>
                <li>Check that the model name is valid (use the connection test above)</li>
                <li>Ensure all required parameters are provided to the OpenAI node</li>
                <li>Update n8n to the latest version</li>
                <li>Add proper error handling to check for undefined responses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">The Error Occurs When:</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>The OpenAI API returns an undefined response</li>
                <li>Network issues prevent the API call from completing</li>
                <li>Invalid API key or rate limiting occurs</li>
                <li>The response structure doesn't match expected format</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAITester;
