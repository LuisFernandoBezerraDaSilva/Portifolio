const logger = require('./logService');

class BaseService {
  constructor(model, schema) {
    this.model = model;
    this.schema = schema;
  }

  async create(data, schema, model) {
    try {
      this.validate(data, schema ? schema : this.schema);
      const modelToUse = model ? model : this.model;
      return await modelToUse.create({ data });
    } catch (e) {
      logger.logError(e); 
      throw new Error(`Error creating record for ${this.schema?._type || 'entity'}`);
    } 
  }

  async getAll() {
    try {
      return await this.model.findMany();
    } catch (e) {
      logger.logError(e);
      throw new Error(`Error getting records for ${this.schema?._type || 'entity'}`);
    }
  }

  async getOne(id) {
    try{
      const item = await this.model.findUnique({ where: { id: id } });
      if (!item) throw new Error('Item not found');
      return item;
    } catch (e) {
      logger.logError(e);
      throw new Error(`Error getting record for ${this.schema?._type || 'entity'}`);
    }
  }

  async update(id, data) {
    try{
      this.validate(data, this.schema);
      return await this.model.update({
        where: { id: id },
        data,
      });
    } catch (e) {
      logger.logError(e);
      throw new Error(`Error editing record for ${this.schema?._type || 'entity'}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.delete({ where: { id: id } });
    } catch (e) {
      logger.logError(e);
      throw new Error(`Error deleting record for ${this.schema?._type || 'entity'}`);
    } 
  }

  validate(data, schema) {
    try{ 
      const { error } = schema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
      }
    } catch (e) {
      logger.logError(e);
      throw new Error(`Error validating record for ${this.schema?._type || 'entity'}`);
    }
  }
}

module.exports = BaseService;