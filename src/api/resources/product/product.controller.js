import { db } from '../../../models';
const { Op } = require("sequelize");

export default {

    /* Add user api start here................................*/

    async addProduct(req, res, next) {
        try {
            const { categoryId, subCategoryId, childCategoryId, name, slug, brand, status, unitSize, desc, buyerPrice, price, qty, discount, discountPer, total, netPrice } = req.body;
            db.product.findOne({
                where: { name: name }
            })
                .then(product => {
                    if (!product) {
                        return db.product.create({
                            categoryId: categoryId,
                            subCategoryId: subCategoryId,
                            childCategoryId: childCategoryId,
                            name: name,
                            slug: slug,
                            status: parseInt(status) ? 'active' : 'inactive',
                            brand: brand,
                            unitSize: unitSize,
                            desc: desc,
                            buyerPrice: buyerPrice,
                            price: price,
                            qty: qty,
                            discount: discount,
                            discountPer: discountPer,
                            total: total,
                            netPrice: netPrice,
                            photo: req.file ? req.file.location : '',
                        })
                    }
                    throw new RequestError('Already exist product', 409);
                })
                .then(product => {
                    res.status(200).json({ 'success': true, msg: "Successfully inserted product" });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async index(req, res, next) {
        try {
            // const { supplierId, categoryId, subCategoryId } = req.query
            db.product.findAll({
                order: [['createdAt', 'DESC']],
                // where: { supplierId: supplierId, categoryId: categoryId, subCategoryId: subCategoryId }
            })
                .then(product => {
                    res.status(200).json({ 'success': true, product });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },
}


