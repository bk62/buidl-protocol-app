import Navbar from "../navigation/Navbar"
import { Footer } from "../navigation/Footer"


export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    )
}