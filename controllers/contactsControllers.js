import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContactsById,
  updateStatusContactById,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    let { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;

    let favoriteFilter;
    if (favorite === "true") {
      favoriteFilter = true;
    } else if (favorite === "false") {
      favoriteFilter = false;
    }

    const filter = { owner };
    if (favoriteFilter !== undefined) {
      filter.favorite = favoriteFilter;
    }
    console.log(filter);

    const result = await listContacts(filter, { skip, limit });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404, `No contact with id ${id} is found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404, `No contact with id ${id} is found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const result = await addContact({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await updateContactsById(id, req.body);
    if (!result) {
      throw HttpError(404, `No contact with id ${id} is found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateStatusContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await updateStatusContactById(id, req.body);
    if (!result) {
      throw HttpError(404, `No contact with id ${id} is found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
