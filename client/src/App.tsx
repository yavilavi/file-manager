import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/tiptap/styles.css';
import {Route, Routes} from 'react-router';
import Login from './pages/Login.tsx';
import PrivateLayout from './components/PrivateLayout/PrivateLayout.tsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.tsx';
import CompanyRegistration from './pages/signup/CompanyRegistration.tsx';
import DocumentsEditor from './apps/documents-manager/DocumentsEditor.tsx';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<CompanyRegistration/>}/>
            <Route path="/documents/:fileId/edit/" element={
                <PrivateRoute>
                    <DocumentsEditor/>
                </PrivateRoute>
            }/>
            <Route
                path="*"
                element={
                    <PrivateRoute>
                        <PrivateLayout/>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;
