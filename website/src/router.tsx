import { createHashRouter } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Faq from './pages/Faq'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Partners from './pages/Partners'
import Plus from './pages/Plus'
import Questionnaire from './pages/Questionnaire'
import Results from './pages/Results'

// Hash routes (/#/check) so the static build works on GitHub Pages without redirects.
export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/check', element: <Questionnaire /> },
      { path: '/results', element: <Results /> },
      { path: '/learn', element: <Learn /> },
      { path: '/partners', element: <Partners /> },
      { path: '/pricing', element: <Plus /> },
      { path: '/about', element: <About /> },
      { path: '/faq', element: <Faq /> },
      { path: '*', element: <Home /> },
    ],
  },
])
