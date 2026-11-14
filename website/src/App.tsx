import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AnswersProvider } from './state/AnswersContext'
import { PlusProvider } from './state/PlusContext'

export default function App() {
  return (
    <AnswersProvider>
      <PlusProvider>
        <RouterProvider router={router} />
      </PlusProvider>
    </AnswersProvider>
  )
}
