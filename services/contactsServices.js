import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, query) =>
  Contact.find(filter, "-__v", query);

export const getContactById = (id) => Contact.findById(id, "-__v");

export const addContact = (data) => Contact.create(data);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const updateContactsById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const updateStatusContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);
