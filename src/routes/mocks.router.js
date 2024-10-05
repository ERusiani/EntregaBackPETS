import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';
import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";

const router = Router();

const generateUser =  () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password:  createHash("coder123"), 
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: []
    };
};

const generateUserMock =  (paramNumeric) => {
    const users = [];
    for (let i = 1; i < paramNumeric; i++) {
        const user = generateUser();
        users.push(user);
    }
    return users;
};

export const generatePets = (numPets) => {
    const pets = [];
    for (let i = 0; i < numPets; i++) {
        const specie = faker.helpers.arrayElement(['dog', 'cat', 'rabbit', 'bird']);
        let name;

        switch (specie) {
            case 'dog':
                name = faker.animal.dog();
                break;
            case 'cat':
                name = faker.animal.cat();
                break;
            case 'rabbit':
                name = faker.animal.rabbit();
                break;
            case 'bird':
                name = faker.animal.bird();
                break;
        }

        const pet = {
            name,
            specie,
            adopted: false,
            owner: null,
        };
        pets.push(pet);
    }
    return pets;
};

router.get('/mockingusers',  (req, res) => {
    const users =  generateUserMock(50);
    res.send({ status: 'success', data: users });
});


router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body;


    if (!users || !pets) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }

    const generatedUsers = await generateUserMock(users);
    const insertedUsers = [];
    for (const user of generatedUsers) {
        insertedUsers.push(user); 
    }

 
    const generatedPets = generatePets(pets);
    const insertedPets = [];
    for (const pet of generatedPets) {
        const petDTO = PetDTO.getPetInputFrom({
            name: pet.name,
            specie: pet.specie,
        });
        const result = await petsService.create(petDTO); 
        insertedPets.push(result);
    }

    res.send({
        status: 'success',
        data: { users: insertedUsers, pets: insertedPets },
    });
});
export default router;