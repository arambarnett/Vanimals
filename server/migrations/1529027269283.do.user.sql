begin;

create table users (
	user_id bigint generated by default as identity not null,
	name text not null,
	icon_url text,
	facebook_account_id bigint references facebook_accounts(facebook_account_id) not null,
	updated_at timestamp default now(),
	created_at timestamp default now(),
	constraint user_pkey primary key (user_id)
);

commit;
