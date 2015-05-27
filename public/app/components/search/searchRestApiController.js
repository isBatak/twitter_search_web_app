app
    .controller('SearchRestApiController', [ '$scope', 'SearchRestApiService',  function ($scope, SearchRestApiService) {

        var count = 20; //max twitts per page

        $scope.title = 'Twitter REST API Search';

        $scope.spawnSearch = init;
        $scope.pageChanged = pageChanged;
        $scope.hideNav = true;
        $scope.history = [];
        $scope.searchText = '';


        // **********************************************************
        // Private Methods
        // **********************************************************
        /**
         *
         * @param q
         */
        function init(q) {
            $scope.searchText = q;
            var params = {
                'q': q,
                'count': count
            }
            SearchRestApiService.getTwitts(params).then( firstPage );
        }

        /**
         *
         * @param response
         */
        function firstPage(response){

            renderTwitts(response);

            //Check if there is more than one page
            if(hasOwnProperty($scope.searchMetadata, 'next_results')){
                $scope.hideNav = false;
            }
            else{
                $scope.hideNav = true;
            }

            // reset pageing
            $scope.currentPage = $scope.oldPage = 1;
        }

        /**
         *
         */
        function pageChanged(){
            if($scope.currentPage > $scope.oldPage){
                console.log( 'next ' + $scope.currentPage );

                var params = getParamsToObject( $scope.searchMetadata.next_results );
                SearchRestApiService.getTwitts( params ).then( renderTwitts );

                $scope.history.push($scope.searchMetadata.max_id_str);

                $scope.oldPage = $scope.currentPage;
            }
            else if($scope.currentPage < $scope.oldPage){
                console.log('prev ' + $scope.currentPage);

                var params = {
                    count: count,
                    include_entities: "1",
                    max_id: $scope.history.pop(),
                    q: $scope.searchMetadata.query,
                };

                SearchRestApiService.getTwitts( params ).then( renderTwitts );

                $scope.oldPage = $scope.currentPage;
            }
        }

        /**
         *
         * @param response
         */
        function renderTwitts(response){
            $scope.searchMetadata = response.search_metadata;
            $scope.twitts = response.statuses;

            // TODO logic for the last page (disable Older Button)
        }

        /**
         * Check if given object has a property.
         * @param obj
         * @param prop
         * @returns {boolean}
         */
        function hasOwnProperty(obj, prop) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) &&
                (!(prop in proto) || proto[prop] !== obj[prop]);
        }

        /**
         * Convert string containing HTTP GET variables into object
         * @param getParams
         * @returns {*}
         */
        function getParamsToObject(getParams){
            //remove '?' character from bigining of the string
            if (getParams.substring(0, 1) == '?') {
                getParams = getParams.substring(1);
            }

            //replace the '&' with ',' and '=' with ':'
            getParams = getParams.replace(/&/g, '","').replace(/=/g, '":"');

            //assemble the JSON string and parse it to object
            return JSON.parse(
                '{"' + getParams + '"}',
                function(key, value) {
                    return (key === "")? value : decodeURIComponent(value) ;
                }
            );
        }
    }]);