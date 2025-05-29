class BaseController {
    constructor(service) {
      this.service = service;
    }
  
    async create(req, res) {
      try {
        const newItem = await this.service.create(req.body);
        res.status(201).json(newItem);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    async getAll(req, res) {
      try {
        const items = await this.service.getAll();
        res.status(200).json(items);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    async getOne(req, res) {
      try {
        const { id } = req.params;
        const item = await this.service.getOne(id);
        res.status(200).json(item);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    }
  
    async update(req, res) {
      try {
        const { id } = req.params;
        const updatedItem = await this.service.update(id, req.body);
        res.status(200).json(updatedItem);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    async delete(req, res) {
      try {
        const { id } = req.params;
        await this.service.delete(id);
        res.status(204).send();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  
  module.exports = BaseController;