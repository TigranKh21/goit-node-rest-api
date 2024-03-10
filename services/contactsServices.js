import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const updateContactsById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const updateStatusContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);
