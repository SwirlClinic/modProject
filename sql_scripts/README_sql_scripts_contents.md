# Group 23 - sql_scripts folder contents

Same Content as Phase 2
==================================
* create_db.sql - Simple SQL script that creates database (and drops old database if it exists).
* table_definitions.sql - SQL script that creates all of the tables for the database.
* assertions.sql - SQL script with triggers used as assertions (usually run after data dump).
* generated_data_import_script.sql - SQL script used to import generated data from group server.
* local_version_data_import_script.sql - SQL script that was ran to import generated data
			                 during the demo in phase 2.
* data_generation/
*			data_generation.py - Python 2 script that creates data for the database.
*			README_DataGen... - Read me file to learn what needs to be done to run
                                            the script.

Changed/New Content in Phase 3
===================================================
* example_queries.sql - A SQL file that lists queries that will be used by our application.
											- This was updated to improve some of the queries and present new
											- queries that we are using in our application. The implementation
											- of these queries that are actually being used by the app can be
											- found in the /app/routeAPI.js file.
* indexes.sql - A list of index creation commands that are being used in our database to
							- speed up queries.
