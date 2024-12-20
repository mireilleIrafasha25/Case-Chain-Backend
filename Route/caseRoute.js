import express from 'express';
import { createCase, getAllCases, updateCase, deleteCase } from '../controller/caseController.js';
//import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/addCase', createCase);
router.get('/getAllcase', getAllCases);
router.put('/updateCase/:id', updateCase);
router.delete('/deleteCase/:id', deleteCase);

export default  router;
