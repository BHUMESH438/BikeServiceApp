import { StatusCodes } from 'http-status-codes';
import ServiceModel from '../model/ServiceModel.js';

export const createSerice = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const serviceCreated = await ServiceModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ serviceCreated });
};

export const getAllService = async (req, res) => {
  console.log(req.user);
  const ServiceDetails = await ServiceModel.find({
    createdBy: req.user.userId
  });
  res.status(StatusCodes.OK).json({ ServiceDetails });
};

export const getSingleService = async (req, res) => {
  const singleServiceDetail = await ServiceModel.findById(req.params.id);
  res.status(StatusCodes.OK).json({ singleServiceDetail });
};

export const editService = async (req, res) => {
  const editService = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.status(StatusCodes.OK).json({ service: editService });
};

export const deleteService = async (req, res) => {
  const deleteService = await ServiceModel.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ deleteService });
};
