import { Outlet } from "react-router-dom"
import Container from "../../components/Container/Index"
import GlobalContextProvider from "../../context/GlobalContext"

function Home() {

    return (
        <main>
            <GlobalContextProvider>
                <Container>
                    <Outlet />
                </Container>
            </GlobalContextProvider>
        </main>
    )
}
export default Home