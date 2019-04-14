CODE AND EXECUTION

The attached files contain all the code needed to replicate the computations and run the dashboard. The folders are:
- data: which contains all the datasets considered in the dashboard
- library: with a set of functions to load and process the data
- notebooks: jupyter notebooks to perform most of the data processing. These notebooks generate the final json files that are used to build the dashboard.
- web: with all the resources to host and launch the dashboard web application

To execute the dashboard, the following command needs to be executed from the command line (UNIX), within the “web” folder:
	./run
Or similarly:
	python -m http.server 8000

Then, the dashboard is accessible from a web browser on:
http://localhost:8000/
