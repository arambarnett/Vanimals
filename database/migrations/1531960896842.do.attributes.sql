begin;

create table attributes (
	attribute_id bigint generated by default as identity not null,
	name text not null,
	updated_at timestamp default now(),
	created_at timestamp default now(),
	constraint attribute_pkey primary key (attribute_id)
);

create table vanimal_attributes(
	vanimal_id bigint references vanimals(vanimal_id) not null,
	attribute_id bigint references attributes(attribute_id) not null,
	updated_at timestamp default now(),
	created_at timestamp default now()
);

insert into attributes(name) values 
	('Diamond'),
	('Green'),
	('Gold'),
	('Orange'),
	('Tourquoise'),
	('Galaxy'),
	('Chrome'),
	('Purple'),
	('Jade'),
	('Lemon'),
	('Red'),
	('Water'),
	('Lobster'),
	('Copper'),
	('Green Fractal'),
	('Circut Board'),
	('Raspberry'),
	('Glowing Moss'),
	('Speckled Blue');

commit;
