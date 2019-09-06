//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
// import Nem from './../src/hw-app-nem';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

// describe('Pets', () => {
//     beforeEach((done) => {
//         //Before each test we empty the database in your case
//         done();
//     });

//     // describe('/GET pets', () => {
//     //     it('it should GET all the pets', (done) => {
//     //         chai.request(server)
//     //             .get('/pets')
//     //             .end((err, res) => {
//     //                 res.should.have.status(200);
//     //                 res.body.should.be.a('array');
//     //                 res.body.length.should.be.eql(9); // fixme :)
//     //                 done();
//     //             });
//     //     });
//     // });
// });