'use strict';

angular.module('starter.services')
	.service('dbURL', [dbURL]);

function dbURL() {
  return {
    url: "https://mysterious-waters-23406.herokuapp.com"
    // url: "http://localhost:2000"
  };
}