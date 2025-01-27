class AttributesService {
    constructor(prisma) {
      this.prisma = prisma;
    }
  
     // Create a new attribute
  async createAttribute(data) {
    // Ensure `value` is passed as an array of objects (JSON)
    return await this.prisma.attributes.create({
      data: {
        name: data.name, // assuming name is passed as part of the form data
        value: data.value, // directly pass the value array
      },
    });
  }
  
    // Get all attributes
    async getAllAttributes() {
      return await this.prisma.attributes.findMany();
    }
  
    // Get a single attribute by ID
    async getAttributeById(id) {
      return await this.prisma.attributes.findUnique({
        where: { id },
      });
    }
  
    // Update an attribute by ID
    async updateAttribute(id, data) {
      return await this.prisma.attributes.update({
        where: { id },
        data: {
        name: data.name, 
        value: data.value
      },
      });
    }
  
    // Delete an attribute by ID
    async deleteAttribute(id) {
      return await this.prisma.attributes.delete({
        where: { id },
      });
    }
  }
  
  module.exports = AttributesService;
  