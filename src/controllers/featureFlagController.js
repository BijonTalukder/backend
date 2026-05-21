const FeatureFlagService = require('../services/FeatureFlag/featureFlagService');

class FeatureFlagController {
  constructor(prisma) {
    this.service = new FeatureFlagService(prisma);
  }

  async getAll(req, res, next) {
    try {
      const flags = await this.service.getAll();
      res.json({ success: true, data: flags });
    } catch (error) {
      next(error);
    }
  }

  async getByKey(req, res, next) {
    try {
      const flag = await this.service.getByKey(req.params.key);
      if (!flag) return res.status(404).json({ success: false, message: 'Flag not found' });
      res.json({ success: true, data: flag });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const flag = await this.service.create(req.body);
      res.status(201).json({ success: true, data: flag });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const flag = await this.service.update(req.params.id, req.body);
      if (!flag) return res.status(404).json({ success: false, message: 'Flag not found' });
      res.json({ success: true, data: flag });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await this.service.remove(req.params.id);
      res.json({ success: true, message: 'Flag deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getAppConfig(req, res, next) {
    try {
      let config = await this.service.getAppConfig();
      if (!config) {
        config = await this.service.createAppConfig({});
      }
      const flags = await this.service.getEnabledForPlatform('android');
      res.json({
        success: true,
        data: {
          config,
          flags,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAppConfig(req, res, next) {
    try {
      const config = await this.service.updateAppConfig(req.body);
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeatureFlagController;
