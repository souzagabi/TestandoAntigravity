import express from 'express';
import cors from 'cors';
import { sequelize } from './database/config/database';

// Import associations
import { setupComprasAssociations } from './database/models/compras/comprasAssociations';

// Import routes
import produtoRoutes from './routes/produto/produtoRoutes';
import listaComprasRoutes from './routes/compras/listaComprasRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Setup associations
setupComprasAssociations();

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/produtos', produtoRoutes);
app.use('/api/lista-compras', listaComprasRoutes);

// Database sync and server start
sequelize.sync().then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to sync database:', error);
});

export default app;
