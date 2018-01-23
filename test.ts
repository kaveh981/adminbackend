// import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import { Category, Users, Roles, Employees } from "./model-layer";

const options: ConnectionOptions = {
    type: "mysql",
    host: "mysql6.gear.host",
    port: 3306,
    username: "mgmdb",
    password: "Gp7uQ-?f414F",
    database: "mgmdb",

    entities: [
        Users, Roles, Employees, Category
    ],
    synchronize: false

};

console.log('hereeeeeee');
async function test() {
    let connection = await createConnection(options);
    let category1 = new Category();
    category1.name = "category #2";
}

test();
// createConnection(options).then(connection => {
//     let categoryRepository = connection.getRepository(Category);

//     categoryRepository.findOneById(3).then(cat => {
//         console.log(JSON.stringify(cat));
//         // let category1 = new Category();
//         // category1.name = "category #2";
//         // cat.oneCategory = category1;
//         // cat.manyCategories.push(category1);
//         // cat.oneManyCategory = category1;

//         // categoryRepository.save(cat).then(ncat => {
//         //     console.log(JSON.stringify(ncat));
//         // })

//     });
// });
//     let category1 = new Category();
//     category1.name = "category #1";
//     let category2 = new Category();
//     category2.name = "category #2";
//     let category3 = new Category();
//     category3.name = "category #3";
//     //category2.oneCategory = category2
//     let category4 = new Category();
//     category4.name = "category #4";

//     category3.manyCategories.push(category4);
//     category2.manyCategories.push(category3);
//     category3.oneManyCategory = category4;
//     category3.oneCategory =category4;
//     category2.oneManyCategory = category3;
//     category2.oneCategory = category3;
//     let mainCategory = new Category();
//     mainCategory.name = "main category";
//     mainCategory.oneCategory = category1;
//     mainCategory.manyCategories.push(category1, category2);
//     mainCategory.oneManyCategory = category1;

//     categoryRepository.save(mainCategory)
//         .then(savedCategory => {
//             console.log("saved category: ", JSON.stringify(savedCategory) + '\n');
//             console.log('manyCategories ' + JSON.stringify(mainCategory.manyCategories) + '\n');
//             console.log('manyInverseCategories ' + JSON.stringify(mainCategory.manyInverseCategories) + '\n');
//             console.log('oneCategory ' + JSON.stringify(mainCategory.oneCategory) + '\n');
//             console.log('oneInverseCategory ' + JSON.stringify(mainCategory.oneInverseCategory) + '\n');
//             console.log('oneManyCategories ' + JSON.stringify(mainCategory.oneManyCategories) + '\n');
//             console.log('oneManyCategory ' + JSON.stringify(mainCategory.oneManyCategory) + '\n');
//         })
//         .catch(error => console.log("Cannot save. Error: ", error.stack ? error.stack : error));

// }, error => console.log("Cannot connect: ", error.stack ? error.stack : error));

// 2{
//     "oneManyCategories":[{ "oneManyCategories": [], "manyCategories": [], "manyInverseCategories": [], "id": 1, "name": "main category" }],
//         "manyCategories":[],
//             "manyInverseCategories":[{ "oneManyCategories": [], "manyCategories": [], "manyInverseCategories": [], "id": 1, "name": "main category" }],
//                 "id":2,
//                     "name":"category #1",
//                         "oneInverseCategory":{ "oneManyCategories":[], "manyCategories":[], "manyInverseCategories":[], "id":1, "name":"main category" }
// }


// 1{
//     "oneManyCategories":[],
//         "manyCategories":[{ "oneManyCategories": [], "manyCategories": [], "manyInverseCategories": [], "id": 2, "name": "category #1" }],
//             "manyInverseCategories":[],
//                 "id":1,
//                     "name":"main category",
//                         "oneManyCategory":{ "oneManyCategories":[], "manyCategories":[], "manyInverseCategories":[], "id":2, "name":"category #1" }
// }


