// ============================================================
// Controller: Clients
// ============================================================

const Client = require('../models/client.model');
const path = require('path');
const fs = require('fs');

exports.getAllClients = async (req, res, next) => {
  try {
    const { active } = req.query;
    const clients = await Client.getAll({ activeOnly: active === 'true' });
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.getById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const { name, service_provided, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    let logo_url = null;
    if (req.file) {
      logo_url = `/uploads/clients/${req.file.filename}`;
    }

    const newClient = await Client.create({
      name,
      service_provided,
      sort_order: sort_order || 0,
      logo_url
    });

    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const { name, service_provided, sort_order, is_active } = req.body;
    const client = await Client.getById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (service_provided !== undefined) updates.service_provided = service_provided;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;

    if (req.file) {
      updates.logo_url = `/uploads/clients/${req.file.filename}`;
      // delete old image if exists
      if (client.logo_url) {
        const oldPath = path.join(__dirname, '../../', client.logo_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await Client.update(req.params.id, updates);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.toggleClient = async (req, res, next) => {
  try {
    const client = await Client.getById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    const toggled = await Client.toggle(req.params.id);
    res.json({ success: true, data: toggled });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.getById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

    if (client.logo_url) {
      const oldPath = path.join(__dirname, '../../', client.logo_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await Client.remove(req.params.id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};
