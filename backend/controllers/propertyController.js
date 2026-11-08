import Property from "../models/Property.js";
import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

// Helper: files ko ImageKit pe upload karo
const uploadImages = async (files = []) => {
  const results = [];
  for (const file of files) {
    const uploaded = await imagekit.files.upload({
      file: await toFile(file.buffer, file.originalname),
      fileName: file.originalname,
      folder: "/realestate",
    });
    results.push({ url: uploaded.url, fileId: uploaded.fileId });
  }
  return results;
};

// POST /api/properties  (protected)
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, type, city, address, area, bedrooms, bathrooms } = req.body;

    if (!title || !description || !price || !type || !city || !address || !area) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    if (req.files && req.files.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images allowed" });
    }

    const images = await uploadImages(req.files);

    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      price,
      type,
      location: { city, address },
      area,
      bedrooms,
      bathrooms,
      images,
    });

    res.status(201).json({ property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/properties?city=&type=&minPrice=&maxPrice=&minArea=&maxArea=&page=&limit=
export const getProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, minArea, maxArea, bedrooms } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;

    const filter = {};
    if (city) filter["location.city"] = { $regex: city, $options: "i" };
    if (type) filter.type = type;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = Number(minArea);
      if (maxArea) filter.area.$lte = Number(maxArea);
    }

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ properties, page, pages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ property });
  } catch (err) {
    res.status(400).json({ message: "Invalid property id" });
  }
};

// GET /api/properties/mine  (protected)
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/properties/:id  (protected, sirf owner)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this property" });
    }

    const { title, description, price, type, city, address, area, bedrooms, bathrooms } = req.body;
    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (type) property.type = type;
    if (city) property.location.city = city;
    if (address) property.location.address = address;
    if (area) property.area = area;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;

    // Nayi images aayi toh purani mein jodo (total max 4)
    if (req.files && req.files.length > 0) {
      if (property.images.length + req.files.length > 4) {
        return res.status(400).json({ message: "Maximum 4 images allowed in total" });
      }
      const newImages = await uploadImages(req.files);
      property.images.push(...newImages);
    }

    await property.save();
    res.json({ property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/properties/:id  (protected, sirf owner)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this property" });
    }

    // ImageKit se images bhi hatao
    for (const img of property.images) {
      if (img.fileId) {
        try {
          await imagekit.files.delete(img.fileId);
        } catch (e) {
          console.error("ImageKit delete failed:", e.message);
        }
      }
    }

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};