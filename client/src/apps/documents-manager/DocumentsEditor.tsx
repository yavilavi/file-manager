import React from 'react';
import {fetchEditorConfig} from "../../services/api/fetchEditorConfig.ts";
import {useQuery} from '@tanstack/react-query';
import {EditorConfigInterface} from "../../types/interfaces/editor-configInterface.ts";
import {useParams} from 'react-router';
import {DocumentEditor} from "@onlyoffice/document-editor-react"
import {Group} from '@mantine/core';

const DocumentsEditor: React.FC = () => {
    const {fileId} = useParams();
    const {
        data: editorConfig,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['editorConfig', fileId],
        queryFn: () => fetchEditorConfig(Number(fileId)),
        initialData: {} as EditorConfigInterface,
        refetchOnWindowFocus: false,
    })

    if (isLoading) {
        return <div>Cargando editor...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const onDocumentReady = (): void => {
        console.log("Document is loaded")
    }

    const onLoadComponentError = (errorCode: number, errorDescription: string): void => {
        console.log("Error loading component", errorCode, errorDescription)
        switch (errorCode) {
            case -1: // Unknown error loading component
                console.log("case: -1", errorDescription)
                break

            case -2: // Error load DocsAPI from http://documentserver/
                console.log("case: -2", errorDescription)
                break

            case -3: // DocsAPI is not defined
                console.log("case: -3", errorDescription)
                break
        }
    }
    console.log('Editor URL:', editorConfig);
    return (
        editorConfig?.config && (
            <Group mb="md" align="center" h="100vh" w="100%">
                <DocumentEditor
                    id="docxEditor"
                    documentServerUrl="http://localhost/"
                    config={{...editorConfig?.config, token: editorConfig?.token}}
                    events_onDocumentReady={onDocumentReady}
                    onLoadComponentError={onLoadComponentError}
                    events_onError={(e) => console.log("Error loading component", e)}
                    height="100%"
                />
            </Group>
        )
    )
};

export default DocumentsEditor;
