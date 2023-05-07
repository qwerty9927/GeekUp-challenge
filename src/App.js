import logo from './logo.svg';
import './App.css';
import { Layout } from "antd"
import Header from './component/Header'
import Container from './component/Container';
import Footer from './component/Footer'
function App() {
  return (
    <div className="App">
      <Layout>
        <Header />
        <Container />
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
