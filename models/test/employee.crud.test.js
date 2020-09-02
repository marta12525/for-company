const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getConnectionString();

      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Name1 #2', lastName: 'Name2 #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Name1 #1', lastName: 'Name1 #1', department: 'Department #1' });
      const expectedFirstName = 'Name1 #1';
      const expectedLastName = 'Name2 #1';
      const expectedDepartment = 'Department #1';
      expect(employee.firstName).to.be.equal(expectedFirstName);
      expect(employee.lastName).to.be.equal(expectedLastName);
      expect(employee.department).to.be.equal(expectedDepartment);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Name1 #1', lastName: 'Name #1', department: 'Department #1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Name1 #2', lastName: 'Name2 #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' },
        { $set: { firstName: '=Name1 #1=', lastName: '=Name2 #1=', department: '=Department #1=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=Name1 #1=',
        lastName: '=Name2 #1=',
        department: '=Department #1='
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      employee.firstName = '=Name1 #1=';
      employee.lastName = '=Name2 #1=';
      employee.department = '=Department #1=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=Name1 #1=',
        lastName: '=Name2 #1=',
        department: '=Department #1='
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Name1 #2', lastName: 'Name2 #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      const removeEmployee = await Employee.findOne({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'Name1 #1', lastName: 'Name2 #1', department: 'Department #1' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  after(() => {
    mongoose.models = {};
  });
});