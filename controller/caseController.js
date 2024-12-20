import  Case from '../Model/caseModel.js';

// Create a new case
export const createCase = async (req, res) => {
  try {
    const { title, description, ownerNationalId } = req.body;
    const submittedBy = req.user.id; // From middleware

    const newCase = new Case({ title, description, ownerNationalId, submittedBy });
    await newCase.save();

    res.status(201).json({ message: 'Case created successfully', case: newCase });
  } catch (error) {
    res.status(500).json({ message: 'Error creating case', error });
  }
};

// Get all cases
export const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('submittedBy', 'fullName email nationalId');
    res.status(200).json({ cases });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases', error });
  }
};

// Update a case
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCase = await Case.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ message: 'Case updated successfully', case: updatedCase });
  } catch (error) {
    res.status(500).json({ message: 'Error updating case', error });
  }
};

// Delete a case
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCase = await Case.findByIdAndDelete(id);
    if (!deletedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting case', error });
  }
};
