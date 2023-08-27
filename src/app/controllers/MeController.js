const Course = require('../models/Course');
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');

class MeController {

    // [GET] /me/stored/courses
    storedCourses(req, res, next) {

        let courseQuery = Course.find({owner:res.locals.user});


        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type
            });
        };
        Promise.all([courseQuery, Course.countDocumentsDeleted({owner: res.locals.user})])
            .then(([courses, deletedCount]) => 
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                })
            )
            .catch(next);
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({owner: res.locals.user})
            .then(courses => res.render('me/trash-courses', {
                courses: multipleMongooseToObject(courses),
            }))
            .catch(next);
    }
}

module.exports = new MeController();