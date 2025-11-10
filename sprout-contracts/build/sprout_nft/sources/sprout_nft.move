// Simplified Sprout NFT Smart Contract
// Only handles NFT minting and ownership - all stats stored off-chain in database
module sprout_addr::sprout_nft {
    use std::string::{Self, String};
    use std::signer;
    use std::option;
    use std::vector;
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;

    // Simple Sprout NFT - just the on-chain essentials
    struct SproutToken has key {
        // Core immutable attributes
        species: String,      // 'Dragon', 'Elephant', 'Tiger', etc.
        rarity: String,       // 'Common', 'Rare', 'Epic', 'Legendary'

        // References for token management
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
    }

    // Collection data
    struct CollectionData has key {
        collection_name: String,
        total_minted: u64,
    }

    // Admin capability
    struct AdminCapability has key, store {}

    // Helper function to convert u64 to string
    fun u64_to_string(value: u64): String {
        if (value == 0) {
            return string::utf8(b"0")
        };

        let buffer = vector::empty<u8>();
        let temp = value;

        while (temp > 0) {
            let digit = ((temp % 10) as u8) + 48; // 48 is ASCII '0'
            vector::push_back(&mut buffer, digit);
            temp = temp / 10;
        };

        // Reverse the buffer since we built it backwards
        vector::reverse(&mut buffer);
        string::utf8(buffer)
    }

    // Initialize the Sprout collection (one-time setup)
    public entry fun initialize_collection(admin: &signer) {
        let admin_addr = signer::address_of(admin);

        // Only allow initialization once
        assert!(!exists<CollectionData>(admin_addr), E_ALREADY_INITIALIZED);

        // Create the collection
        let collection_name = string::utf8(b"Sprouts Collection");
        let description = string::utf8(b"Sprouts - Digital companions that grow with your goals");
        let uri = string::utf8(b"https://sprouts.app/collection");

        collection::create_unlimited_collection(
            admin,
            description,
            collection_name,
            option::none(),
            uri,
        );

        // Store collection data
        move_to(admin, CollectionData {
            collection_name,
            total_minted: 0,
        });

        // Store admin capability
        move_to(admin, AdminCapability {});
    }

    // Mint a new Sprout NFT
    public entry fun mint_sprout(
        admin: &signer,
        to: address,
        name: String,
        species: String,
        rarity: String,
        uri: String,
    ) acquires CollectionData {
        let admin_addr = signer::address_of(admin);

        // Verify admin
        assert!(exists<AdminCapability>(admin_addr), E_NOT_AUTHORIZED);

        // Get collection data
        let collection_data = borrow_global_mut<CollectionData>(admin_addr);
        let collection_name = collection_data.collection_name;

        // FIXED: Create unique token name with counter to avoid EOBJECT_EXISTS error
        // Append the mint count to make each token name unique
        let counter_str = u64_to_string(collection_data.total_minted);
        let separator = string::utf8(b" #");
        string::append(&mut name, separator);
        string::append(&mut name, counter_str);
        let token_name = name;

        // Create the token
        let constructor_ref = token::create_named_token(
            admin,
            collection_name,
            string::utf8(b"A Sprout that grows with your goals"),
            token_name,
            option::none(),
            uri,
        );

        let token_signer = object::generate_signer(&constructor_ref);

        // Create mutator refs
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);

        // Initialize Sprout with minimal on-chain data
        let sprout = SproutToken {
            species,
            rarity,
            mutator_ref,
            burn_ref,
        };

        move_to(&token_signer, sprout);

        // Transfer to user
        let token_obj = object::object_from_constructor_ref<token::Token>(&constructor_ref);
        object::transfer(admin, token_obj, to);

        // Update count
        collection_data.total_minted = collection_data.total_minted + 1;
    }

    // Burn a Sprout (when goal is permanently failed)
    public entry fun burn_sprout(
        admin: &signer,
        token_address: address,
    ) acquires SproutToken {
        let admin_addr = signer::address_of(admin);
        assert!(exists<AdminCapability>(admin_addr), E_NOT_AUTHORIZED);
        assert!(exists<SproutToken>(token_address), E_NOT_AUTHORIZED);

        let SproutToken {
            species: _,
            rarity: _,
            mutator_ref: _,
            burn_ref,
        } = move_from<SproutToken>(token_address);

        token::burn(burn_ref);
    }

    // View function: Get Sprout info
    #[view]
    public fun get_sprout_info(token_address: address): (String, String) acquires SproutToken {
        assert!(exists<SproutToken>(token_address), E_NOT_AUTHORIZED);
        let sprout = borrow_global<SproutToken>(token_address);
        (sprout.species, sprout.rarity)
    }

    // View function: Get total minted
    #[view]
    public fun get_total_minted(admin_addr: address): u64 acquires CollectionData {
        let collection_data = borrow_global<CollectionData>(admin_addr);
        collection_data.total_minted
    }
}
