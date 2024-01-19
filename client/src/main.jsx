
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline} from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* cssbaseline is used to allow css on material ui components  */}
    <CssBaseline/>
    <App />
  </>,
)
