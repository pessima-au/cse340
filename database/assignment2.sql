--1. insert data into account table
INSERT INTO
    account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES
    (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );


-- 2. update account_type to 'Admin'
UPDATE account
SET
    account_type = 'Admin'
WHERE
    account_email = 'tony@starkent.com';


--3. delete Tony Stark from account table
DELETE FROM account
WHERE
    account_email = 'tony@starkent.com';


-- 4. update text in GM Hummer
UPDATE public.inventory
SET
    inv_description = REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE
    inv_make = 'GM'
    AND inv_model = 'Hummer';


--5. use INNER JOIN to filter Sport cars
SELECT
    inv_make,
    inv_model,
    classification_name
FROM
    inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE
    classification_name = 'Sport';


--6. insert '/vehicles' into image and thumbnail paths
UPDATE public.inventory
SET
    inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');