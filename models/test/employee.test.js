const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no arg', () => {
    const emp = new Employee({}); // create new Employee, but don't set any attr value

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if one or two arguments are missing', () => {
    const emp = new Employee({ firstName: 'Marta', lastName: 'Bed' });

    emp.validate(err => {
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if any arg is not a string', () => {
    const cases = [{}, []];
    for (let arg of cases) {
      const emp = new Employee({ firstName: arg, lastName: arg, department: arg });

      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should return correct emp when args are correctt', () => {
    const emp = new Employee({ firstName: 'Marta', lastName: 'Bed', department: 'IT' });

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});