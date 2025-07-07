import { useRouteError } from 'react-router-dom'
interface IError {
    statusText?: string;
    message?: string;
}
export default function ErrorHandler() {
    const error = useRouteError() as IError || { statusText: 'Unknown Error', message: 'An unexpected error occurred' };
    return (
        <div id='error'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p><i>{error.statusText || error.message}</i></p>
        </div>
    )
}
