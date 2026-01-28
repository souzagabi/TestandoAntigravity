import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// Pages - To be created
import ProdutoListPage from './pages/produto/ProdutoListPage';
import ListaComprasPage from './pages/compras/ListaComprasPage';
import HistoricoComprasPage from './pages/compras/HistoricoComprasPage.tsx';
import ProdutoEditPage from './pages/produto/ProdutoEditPage';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Supermarket System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/produtos">Produtos</Nav.Link>
              <Nav.Link as={Link} to="/compras/nova">Nova Lista</Nav.Link>
              <Nav.Link as={Link} to="/compras/historico">Histórico</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<div className="p-5 mb-4 bg-light rounded-3"><h1>Bem vindo!</h1><p>Selecione uma opção no menu.</p></div>} />
          <Route path="/produtos" element={<ProdutoListPage />} />
          <Route path="/produtos/novo" element={<ProdutoEditPage />} />
          <Route path="/produtos/:id" element={<ProdutoEditPage />} />
          <Route path="/compras/nova" element={<ListaComprasPage />} />
          <Route path="/compras/editar/:id" element={<ListaComprasPage />} />
          <Route path="/compras/historico" element={<HistoricoComprasPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
