"use strict";

const API_URL = "http://demo.wp-api.org/wp-json/wp/v2";

const app = new Vue({
    el: "#app",
    delimiters: ["${", "}"],
    data: {
        research: {
            isFetching: false,
            page: 1,
            per_page: 5,
            data: []
        }
        // some data
    },
    methods: {
        getResearch: function() {
            this.research.isFetching = true;
            this.research.page += 1;

            let url = new URL(`${API_URL}/posts`);
            let params = {
                _embed: 1,
                page: this.research.page,
                per_page: this.research.per_page
            };
            url.search = new URLSearchParams(params);

            fetch(url)
                .then(response => response.json())
                .then(json => {
                    if (json.message) {
                        throw new Error(json.message);
                    }
                    this.research.data.push(...json);
                    this.research.isFetching = false;
                })
                .catch(error => {
                    this.research.isFetching = false;
                    console.log(error.message);
                    UIkit.notification({
                        message: error.message,
                        status: "danger",
                        pos: "top-right",
                        timeout: 3000
                    });
                });
        }
        // some get data
    },
    filters: {
        formatDate: function(value) {
            if (!value) return "";
            value = value.toString();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };
            return new Date(value).toLocaleDateString("uk-UA", options);
        }
    }
});
