import '../styles/globals.css'

// Component is default export of index.js
function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page)
  return (
    getLayout(<Component {...pageProps} />)
  )
}

export default MyApp