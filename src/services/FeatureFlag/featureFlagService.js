class FeatureFlagService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return this.prisma.featureFlag.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByKey(key) {
    return this.prisma.featureFlag.findUnique({ where: { key } });
  }

  async create(data) {
    return this.prisma.featureFlag.create({ data });
  }

  async update(id, data) {
    return this.prisma.featureFlag.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return this.prisma.featureFlag.delete({ where: { id } });
  }

  async getEnabledForPlatform(platform) {
    return this.prisma.featureFlag.findMany({
      where: {
        enabled: true,
        OR: [{ platform: 'all' }, { platform }],
      },
    });
  }

  async getAppConfig() {
    const configs = await this.prisma.appConfig.findMany({ take: 1 });
    return configs.length > 0 ? configs[0] : null;
  }

  async createAppConfig(data) {
    return this.prisma.appConfig.create({ data });
  }

  async updateAppConfig(data) {
    const existing = await this.getAppConfig();
    if (existing) {
      return this.prisma.appConfig.update({
        where: { id: existing.id },
        data,
      });
    }
    return this.createAppConfig(data);
  }
}

module.exports = FeatureFlagService;
