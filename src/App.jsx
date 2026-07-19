import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Trophy, TrendingUp, TrendingDown, Users, Sliders, Calendar, ShoppingBag, Award, ChevronRight, X, ArrowUpCircle, ArrowDownCircle, RotateCcw, GraduationCap } from "lucide-react";

const MLS_ROSTERS = {"atlanta_united_fc":{"name":"Atlanta United FC","players":[{"name":"Aleksey Miranchuk","position":"MID","age":30,"overall":78,"potential":78,"pace":71,"shooting":69,"passing":77,"defense":31,"physical":60},{"name":"Miguel Almiron","position":"FWD","age":32,"overall":76,"potential":76,"pace":85,"shooting":72,"passing":69,"defense":57,"physical":63},{"name":"Emmanuel Latte Lath","position":"FWD","age":27,"overall":71,"potential":71,"pace":86,"shooting":69,"passing":62,"defense":37,"physical":68},{"name":"Lucas Hoyos","position":"GK","age":37,"overall":71,"potential":71,"pace":72,"shooting":69,"passing":68,"defense":61,"physical":66},{"name":"Enea Mihaj","position":"DEF","age":28,"overall":71,"potential":71,"pace":61,"shooting":42,"passing":50,"defense":73,"physical":72},{"name":"Steven Alzate","position":"MID","age":27,"overall":71,"potential":71,"pace":66,"shooting":63,"passing":72,"defense":66,"physical":70},{"name":"Stian Gregersen","position":"DEF","age":31,"overall":70,"potential":70,"pace":78,"shooting":44,"passing":52,"defense":67,"physical":84},{"name":"Pedro Amador","position":"DEF","age":27,"overall":69,"potential":69,"pace":74,"shooting":46,"passing":68,"defense":63,"physical":64},{"name":"Fafa Picault","position":"FWD","age":35,"overall":69,"potential":69,"pace":86,"shooting":66,"passing":61,"defense":38,"physical":49},{"name":"Tristan Muyumba","position":"MID","age":29,"overall":68,"potential":68,"pace":72,"shooting":51,"passing":62,"defense":62,"physical":70},{"name":"Ronald Hernandez","position":"DEF","age":28,"overall":67,"potential":67,"pace":82,"shooting":38,"passing":58,"defense":63,"physical":67},{"name":"Elias Baez","position":"DEF","age":21,"overall":67,"potential":72,"pace":68,"shooting":48,"passing":59,"defense":64,"physical":65},{"name":"Sergio Santos","position":"FWD","age":31,"overall":66,"potential":66,"pace":85,"shooting":63,"passing":55,"defense":34,"physical":68},{"name":"Cayman Togashi","position":"FWD","age":32,"overall":64,"potential":64,"pace":72,"shooting":63,"passing":46,"defense":32,"physical":67},{"name":"Ajani Fortune","position":"MID","age":23,"overall":61,"potential":61,"pace":72,"shooting":49,"passing":60,"defense":48,"physical":63},{"name":"Luke Brennan","position":"FWD","age":21,"overall":59,"potential":64,"pace":64,"shooting":51,"passing":54,"defense":48,"physical":55},{"name":"Will Reilly","position":"MID","age":23,"overall":57,"potential":57,"pace":72,"shooting":53,"passing":57,"defense":45,"physical":63},{"name":"Matthew Edwards","position":"DEF","age":23,"overall":57,"potential":57,"pace":79,"shooting":45,"passing":48,"defense":54,"physical":62}]},"austin_fc":{"name":"Austin FC","players":[{"name":"Myrto Uzuni","position":"FWD","age":31,"overall":74,"potential":74,"pace":81,"shooting":74,"passing":71,"defense":32,"physical":68},{"name":"Mikkel Desler","position":"DEF","age":31,"overall":72,"potential":72,"pace":71,"shooting":60,"passing":68,"defense":68,"physical":68},{"name":"Brandon Vazquez","position":"FWD","age":27,"overall":72,"potential":72,"pace":74,"shooting":71,"passing":54,"defense":34,"physical":74},{"name":"Ilie Sanchez","position":"MID","age":35,"overall":70,"potential":70,"pace":47,"shooting":50,"passing":66,"defense":66,"physical":71},{"name":"Oleksandr Svatok","position":"DEF","age":31,"overall":70,"potential":70,"pace":63,"shooting":36,"passing":54,"defense":71,"physical":71},{"name":"Robert Taylor","position":"FWD","age":31,"overall":69,"potential":69,"pace":80,"shooting":68,"passing":68,"defense":49,"physical":67},{"name":"Brad Stuver","position":"GK","age":35,"overall":69,"potential":69,"pace":70,"shooting":68,"passing":65,"defense":47,"physical":70},{"name":"Jayden Nelson","position":"FWD","age":23,"overall":68,"potential":68,"pace":92,"shooting":59,"passing":58,"defense":48,"physical":59},{"name":"Besard Sabovic","position":"MID","age":28,"overall":68,"potential":68,"pace":55,"shooting":65,"passing":67,"defense":63,"physical":72},{"name":"Dani Pereira","position":"MID","age":25,"overall":68,"potential":68,"pace":80,"shooting":54,"passing":65,"defense":60,"physical":64},{"name":"Joseph Rosales","position":"DEF","age":25,"overall":68,"potential":68,"pace":79,"shooting":44,"passing":60,"defense":62,"physical":65},{"name":"Owen Wolff","position":"MID","age":21,"overall":68,"potential":73,"pace":72,"shooting":59,"passing":67,"defense":61,"physical":67},{"name":"Christian Ramirez","position":"FWD","age":35,"overall":67,"potential":67,"pace":59,"shooting":67,"passing":59,"defense":31,"physical":74},{"name":"Jon Gallagher","position":"DEF","age":30,"overall":65,"potential":65,"pace":78,"shooting":58,"passing":61,"defense":55,"physical":61},{"name":"Guilherme Biro","position":"DEF","age":26,"overall":65,"potential":65,"pace":72,"shooting":40,"passing":56,"defense":61,"physical":70},{"name":"Brendan Hines-Ike","position":"DEF","age":31,"overall":65,"potential":65,"pace":51,"shooting":53,"passing":55,"defense":65,"physical":72},{"name":"Zan Kolmanic","position":"DEF","age":26,"overall":64,"potential":64,"pace":66,"shooting":53,"passing":67,"defense":57,"physical":64},{"name":"Jon Bell","position":"DEF","age":28,"overall":64,"potential":64,"pace":73,"shooting":25,"passing":38,"defense":64,"physical":69},{"name":"Nicolas Dubersarsky","position":"MID","age":21,"overall":61,"potential":66,"pace":59,"shooting":44,"passing":60,"defense":52,"physical":65},{"name":"CJ Fodrey","position":"FWD","age":22,"overall":54,"potential":54,"pace":71,"shooting":53,"passing":35,"defense":17,"physical":61},{"name":"Micah Burton","position":"MID","age":20,"overall":53,"potential":58,"pace":66,"shooting":46,"passing":48,"defense":31,"physical":39}]},"cf_montreal":{"name":"CF Montr\u00e9al","players":[{"name":"Prince Owusu","position":"FWD","age":29,"overall":72,"potential":72,"pace":80,"shooting":71,"passing":50,"defense":38,"physical":85},{"name":"Frankie Amaya","position":"MID","age":25,"overall":68,"potential":68,"pace":72,"shooting":57,"passing":65,"defense":64,"physical":68},{"name":"Brayan Vera","position":"DEF","age":27,"overall":68,"potential":68,"pace":70,"shooting":54,"passing":53,"defense":67,"physical":73},{"name":"Samuel Piette","position":"MID","age":31,"overall":67,"potential":67,"pace":56,"shooting":19,"passing":53,"defense":67,"physical":75},{"name":"Matty Longstaff","position":"MID","age":26,"overall":67,"potential":67,"pace":62,"shooting":62,"passing":65,"defense":53,"physical":64},{"name":"Thomas Gillier","position":"GK","age":22,"overall":67,"potential":67,"pace":69,"shooting":66,"passing":62,"defense":21,"physical":66},{"name":"Tomas Aviles","position":"DEF","age":22,"overall":66,"potential":66,"pace":59,"shooting":47,"passing":58,"defense":64,"physical":68},{"name":"Jalen Neal","position":"DEF","age":22,"overall":66,"potential":66,"pace":74,"shooting":23,"passing":54,"defense":67,"physical":65},{"name":"Wikelman Carmona","position":"MID","age":23,"overall":66,"potential":66,"pace":83,"shooting":59,"passing":59,"defense":39,"physical":59},{"name":"Dagur Dan Thorhallsson","position":"DEF","age":26,"overall":65,"potential":65,"pace":70,"shooting":59,"passing":61,"defense":58,"physical":59},{"name":"Daniel Rios","position":"FWD","age":31,"overall":65,"potential":65,"pace":48,"shooting":72,"passing":47,"defense":26,"physical":61},{"name":"Sebastian Breza","position":"GK","age":28,"overall":64,"potential":64,"pace":63,"shooting":64,"passing":50,"defense":33,"physical":62},{"name":"Hennadii Synchuk","position":"MID","age":20,"overall":64,"potential":69,"pace":67,"shooting":62,"passing":61,"defense":38,"physical":57},{"name":"Efrain Morales","position":"DEF","age":22,"overall":64,"potential":64,"pace":65,"shooting":23,"passing":42,"defense":64,"physical":71},{"name":"Victor Loturi","position":"MID","age":25,"overall":63,"potential":63,"pace":72,"shooting":56,"passing":62,"defense":60,"physical":65},{"name":"Fabian Herbers","position":"MID","age":32,"overall":62,"potential":62,"pace":59,"shooting":61,"passing":63,"defense":59,"physical":66},{"name":"Luca Petrasso","position":"DEF","age":26,"overall":62,"potential":62,"pace":70,"shooting":50,"passing":60,"defense":56,"physical":65},{"name":"Bode Hidalgo","position":"DEF","age":24,"overall":61,"potential":61,"pace":77,"shooting":43,"passing":45,"defense":58,"physical":58},{"name":"Dawid Bugaj","position":"DEF","age":21,"overall":61,"potential":66,"pace":64,"shooting":40,"passing":50,"defense":60,"physical":69},{"name":"Aleksandr Guboglo","position":"MID","age":19,"overall":60,"potential":65,"pace":80,"shooting":38,"passing":53,"defense":51,"physical":61},{"name":"Brandan Craig","position":"DEF","age":22,"overall":59,"potential":59,"pace":65,"shooting":42,"passing":52,"defense":57,"physical":66},{"name":"Owen Graham-Roache","position":"FWD","age":18,"overall":52,"potential":57,"pace":72,"shooting":52,"passing":35,"defense":18,"physical":56}]},"charlotte_fc":{"name":"Charlotte FC","players":[{"name":"Wilfried Zaha","position":"FWD","age":33,"overall":78,"potential":78,"pace":80,"shooting":77,"passing":72,"defense":37,"physical":70},{"name":"Pep Biel","position":"MID","age":29,"overall":77,"potential":77,"pace":70,"shooting":74,"passing":75,"defense":48,"physical":59},{"name":"Kristijan Kahlina","position":"GK","age":33,"overall":76,"potential":76,"pace":76,"shooting":75,"passing":73,"defense":41,"physical":77},{"name":"Ashley Westwood","position":"MID","age":36,"overall":73,"potential":73,"pace":54,"shooting":64,"passing":75,"defense":68,"physical":72},{"name":"Liel Abada","position":"MID","age":24,"overall":72,"potential":72,"pace":87,"shooting":70,"passing":66,"defense":41,"physical":59},{"name":"Tim Ream","position":"DEF","age":38,"overall":72,"potential":72,"pace":45,"shooting":44,"passing":69,"defense":74,"physical":75},{"name":"Luca de la Torre","position":"MID","age":28,"overall":71,"potential":71,"pace":64,"shooting":61,"passing":71,"defense":62,"physical":60},{"name":"David Schnegg","position":"DEF","age":27,"overall":71,"potential":71,"pace":74,"shooting":55,"passing":66,"defense":66,"physical":75},{"name":"Harry Toffolo","position":"DEF","age":30,"overall":71,"potential":71,"pace":67,"shooting":53,"passing":67,"defense":69,"physical":67},{"name":"Henry Kessler","position":"DEF","age":28,"overall":70,"potential":70,"pace":54,"shooting":27,"passing":48,"defense":69,"physical":79},{"name":"Nathan Byrne","position":"DEF","age":34,"overall":69,"potential":69,"pace":77,"shooting":50,"passing":65,"defense":64,"physical":71},{"name":"Kerwin Vargas","position":"MID","age":24,"overall":69,"potential":69,"pace":81,"shooting":61,"passing":66,"defense":37,"physical":60},{"name":"Brandt Bronico","position":"MID","age":31,"overall":68,"potential":68,"pace":67,"shooting":60,"passing":65,"defense":67,"physical":74},{"name":"Djibril Diani","position":"MID","age":28,"overall":68,"potential":68,"pace":63,"shooting":45,"passing":59,"defense":64,"physical":78},{"name":"Idan Toklomati","position":"FWD","age":21,"overall":68,"potential":73,"pace":84,"shooting":64,"passing":51,"defense":26,"physical":61},{"name":"Andrew Privett","position":"DEF","age":25,"overall":65,"potential":65,"pace":63,"shooting":32,"passing":54,"defense":66,"physical":71},{"name":"Tyler Miller","position":"GK","age":33,"overall":62,"potential":62,"pace":61,"shooting":61,"passing":60,"defense":35,"physical":62},{"name":"Tyger Smalls","position":"FWD","age":23,"overall":59,"potential":59,"pace":66,"shooting":56,"passing":58,"defense":26,"physical":45},{"name":"Nimfasha Berchimas","position":"FWD","age":18,"overall":57,"potential":62,"pace":75,"shooting":46,"passing":53,"defense":26,"physical":47}]},"chicago_fire_fc":{"name":"Chicago Fire FC","players":[{"name":"Hugo Cuypers","position":"FWD","age":29,"overall":77,"potential":77,"pace":75,"shooting":77,"passing":67,"defense":44,"physical":78},{"name":"Jonathan Bamba","position":"MID","age":30,"overall":76,"potential":76,"pace":83,"shooting":72,"passing":72,"defense":39,"physical":67},{"name":"Philip Zinckernagel","position":"FWD","age":31,"overall":76,"potential":76,"pace":82,"shooting":74,"passing":73,"defense":42,"physical":67},{"name":"Robin Lod","position":"MID","age":33,"overall":73,"potential":73,"pace":70,"shooting":71,"passing":74,"defense":59,"physical":72},{"name":"Anton Saletros","position":"MID","age":30,"overall":73,"potential":73,"pace":64,"shooting":66,"passing":75,"defense":66,"physical":73},{"name":"Jack Elliott","position":"DEF","age":30,"overall":71,"potential":71,"pace":49,"shooting":24,"passing":48,"defense":72,"physical":81},{"name":"Chris Brady","position":"GK","age":22,"overall":69,"potential":69,"pace":74,"shooting":64,"passing":62,"defense":29,"physical":67},{"name":"Joel Waterman","position":"DEF","age":30,"overall":68,"potential":68,"pace":43,"shooting":42,"passing":58,"defense":68,"physical":74},{"name":"Andrew Gutman","position":"DEF","age":29,"overall":68,"potential":68,"pace":79,"shooting":53,"passing":60,"defense":64,"physical":71},{"name":"Maren Haile-Selassie","position":"MID","age":27,"overall":67,"potential":67,"pace":82,"shooting":59,"passing":61,"defense":42,"physical":62},{"name":"Josh Cohen","position":"GK","age":33,"overall":66,"potential":66,"pace":66,"shooting":65,"passing":65,"defense":28,"physical":66},{"name":"Samuel Rogers","position":"DEF","age":27,"overall":66,"potential":66,"pace":65,"shooting":42,"passing":53,"defense":63,"physical":78},{"name":"Chris Mueller","position":"MID","age":29,"overall":65,"potential":65,"pace":74,"shooting":64,"passing":60,"defense":25,"physical":59},{"name":"Mauricio Pineda","position":"DEF","age":28,"overall":65,"potential":65,"pace":50,"shooting":31,"passing":49,"defense":65,"physical":71},{"name":"Jonathan Dean","position":"DEF","age":29,"overall":64,"potential":64,"pace":72,"shooting":37,"passing":56,"defense":61,"physical":59},{"name":"Jeff Gal","position":"GK","age":33,"overall":63,"potential":63,"pace":63,"shooting":59,"passing":65,"defense":18,"physical":65},{"name":"Leonardo Barroso","position":"DEF","age":21,"overall":63,"potential":68,"pace":74,"shooting":52,"passing":53,"defense":60,"physical":59},{"name":"Sergio Oregel","position":"MID","age":21,"overall":62,"potential":67,"pace":64,"shooting":50,"passing":61,"defense":47,"physical":51},{"name":"David Poreba","position":"MID","age":23,"overall":55,"potential":55,"pace":59,"shooting":40,"passing":53,"defense":50,"physical":62},{"name":"Christopher Cupps","position":"DEF","age":18,"overall":55,"potential":60,"pace":60,"shooting":28,"passing":32,"defense":55,"physical":60}]},"colorado_rapids":{"name":"Colorado Rapids","players":[{"name":"Rob Holding","position":"DEF","age":30,"overall":72,"potential":72,"pace":40,"shooting":34,"passing":58,"defense":73,"physical":66},{"name":"Zack Steffen","position":"GK","age":31,"overall":71,"potential":71,"pace":73,"shooting":69,"passing":69,"defense":51,"physical":67},{"name":"Alexis Manyoma","position":"MID","age":23,"overall":71,"potential":71,"pace":81,"shooting":63,"passing":69,"defense":50,"physical":60},{"name":"Rafael Navarro","position":"FWD","age":26,"overall":71,"potential":71,"pace":70,"shooting":71,"passing":56,"defense":39,"physical":69},{"name":"Reggie Cannon","position":"DEF","age":28,"overall":70,"potential":70,"pace":85,"shooting":35,"passing":57,"defense":66,"physical":77},{"name":"Keegan Rosenberry","position":"DEF","age":32,"overall":70,"potential":70,"pace":68,"shooting":51,"passing":61,"defense":68,"physical":74},{"name":"Hamzat Ojediran","position":"MID","age":22,"overall":70,"potential":70,"pace":62,"shooting":54,"passing":62,"defense":68,"physical":72},{"name":"Andreas Maxso","position":"DEF","age":31,"overall":69,"potential":69,"pace":47,"shooting":45,"passing":54,"defense":68,"physical":80},{"name":"Ian Murphy","position":"DEF","age":25,"overall":67,"potential":67,"pace":66,"shooting":28,"passing":48,"defense":69,"physical":69},{"name":"Miguel Navarro","position":"DEF","age":27,"overall":66,"potential":66,"pace":73,"shooting":31,"passing":51,"defense":63,"physical":66},{"name":"Theodore Ku-DiPietro","position":"MID","age":24,"overall":65,"potential":65,"pace":73,"shooting":59,"passing":55,"defense":38,"physical":56},{"name":"Josh Atencio","position":"MID","age":24,"overall":65,"potential":65,"pace":64,"shooting":46,"passing":52,"defense":66,"physical":77},{"name":"Dante Sealy","position":"MID","age":23,"overall":65,"potential":65,"pace":85,"shooting":67,"passing":54,"defense":34,"physical":51},{"name":"Georgi Minoungou","position":"MID","age":23,"overall":63,"potential":63,"pace":88,"shooting":46,"passing":48,"defense":22,"physical":52},{"name":"Darren Yapi","position":"FWD","age":21,"overall":63,"potential":68,"pace":74,"shooting":59,"passing":46,"defense":22,"physical":60},{"name":"Noah Cobb","position":"DEF","age":20,"overall":61,"potential":66,"pace":71,"shooting":28,"passing":43,"defense":63,"physical":62},{"name":"Lucas Herrington","position":"DEF","age":18,"overall":60,"potential":65,"pace":65,"shooting":32,"passing":42,"defense":59,"physical":66},{"name":"Ali Fadal","position":"MID","age":22,"overall":59,"potential":59,"pace":58,"shooting":47,"passing":58,"defense":55,"physical":52},{"name":"Wayne Frederick","position":"MID","age":22,"overall":56,"potential":56,"pace":65,"shooting":47,"passing":50,"defense":47,"physical":49},{"name":"Alex Harris","position":"FWD","age":21,"overall":53,"potential":58,"pace":71,"shooting":55,"passing":37,"defense":17,"physical":52}]},"columbus_crew":{"name":"Columbus Crew","players":[{"name":"Andre Gomes","position":"MID","age":32,"overall":74,"potential":74,"pace":41,"shooting":65,"passing":75,"defense":70,"physical":69},{"name":"Daniel Gazdag","position":"MID","age":30,"overall":74,"potential":74,"pace":77,"shooting":71,"passing":67,"defense":54,"physical":73},{"name":"Max Arfsten","position":"MID","age":25,"overall":72,"potential":72,"pace":77,"shooting":65,"passing":66,"defense":63,"physical":69},{"name":"Steven Moreira","position":"DEF","age":31,"overall":71,"potential":71,"pace":73,"shooting":33,"passing":67,"defense":71,"physical":74},{"name":"Nariman Akhundzada","position":"FWD","age":22,"overall":71,"potential":71,"pace":77,"shooting":68,"passing":63,"defense":31,"physical":61},{"name":"Hugo Picard","position":"MID","age":23,"overall":70,"potential":70,"pace":78,"shooting":66,"passing":67,"defense":54,"physical":54},{"name":"Patrick Schulte","position":"GK","age":25,"overall":70,"potential":70,"pace":69,"shooting":65,"passing":75,"defense":28,"physical":71},{"name":"Andres Herrera","position":"DEF","age":27,"overall":70,"potential":70,"pace":84,"shooting":63,"passing":62,"defense":66,"physical":70},{"name":"Dylan Chambost","position":"MID","age":28,"overall":70,"potential":70,"pace":63,"shooting":65,"passing":71,"defense":59,"physical":68},{"name":"Mohamed Farsi","position":"MID","age":26,"overall":70,"potential":70,"pace":84,"shooting":53,"passing":64,"defense":63,"physical":57},{"name":"Rudy Camacho","position":"DEF","age":35,"overall":68,"potential":68,"pace":36,"shooting":46,"passing":61,"defense":68,"physical":75},{"name":"Malte Amundsen","position":"DEF","age":28,"overall":68,"potential":68,"pace":74,"shooting":47,"passing":64,"defense":67,"physical":74},{"name":"Sean Zawadzki","position":"DEF","age":26,"overall":68,"potential":68,"pace":73,"shooting":50,"passing":62,"defense":68,"physical":71},{"name":"Wessam Abou Ali","position":"FWD","age":27,"overall":68,"potential":68,"pace":76,"shooting":68,"passing":53,"defense":30,"physical":67},{"name":"Jamal Thiare","position":"FWD","age":33,"overall":67,"potential":67,"pace":87,"shooting":66,"passing":52,"defense":23,"physical":72},{"name":"Nicholas Hagen","position":"GK","age":29,"overall":64,"potential":64,"pace":64,"shooting":62,"passing":61,"defense":33,"physical":64},{"name":"Amar Sejdic","position":"MID","age":29,"overall":64,"potential":64,"pace":47,"shooting":59,"passing":62,"defense":59,"physical":64},{"name":"Evan Bush","position":"GK","age":40,"overall":63,"potential":63,"pace":64,"shooting":64,"passing":63,"defense":17,"physical":64},{"name":"Taha Habroune","position":"MID","age":20,"overall":62,"potential":67,"pace":66,"shooting":50,"passing":59,"defense":50,"physical":48},{"name":"Tristan Brown","position":"DEF","age":18,"overall":57,"potential":62,"pace":76,"shooting":45,"passing":49,"defense":52,"physical":53}]},"dc_united":{"name":"D.C. United","players":[{"name":"Tai Baribo","position":"FWD","age":28,"overall":73,"potential":73,"pace":73,"shooting":74,"passing":55,"defense":28,"physical":72},{"name":"Louis Munteanu","position":"FWD","age":23,"overall":72,"potential":72,"pace":82,"shooting":72,"passing":65,"defense":30,"physical":74},{"name":"Aaron Herrera","position":"DEF","age":28,"overall":70,"potential":70,"pace":71,"shooting":46,"passing":67,"defense":66,"physical":73},{"name":"Kye Rowles","position":"DEF","age":27,"overall":70,"potential":70,"pace":64,"shooting":24,"passing":46,"defense":71,"physical":75},{"name":"Sean Johnson","position":"GK","age":36,"overall":69,"potential":69,"pace":67,"shooting":66,"passing":69,"defense":35,"physical":68},{"name":"Silvan Hefti","position":"DEF","age":28,"overall":68,"potential":68,"pace":70,"shooting":49,"passing":62,"defense":66,"physical":72},{"name":"Gabriel Pirani","position":"MID","age":24,"overall":68,"potential":68,"pace":73,"shooting":61,"passing":67,"defense":41,"physical":57},{"name":"Jared Stroud","position":"MID","age":29,"overall":67,"potential":67,"pace":67,"shooting":56,"passing":65,"defense":54,"physical":67},{"name":"Lucas Bartlett","position":"DEF","age":28,"overall":67,"potential":67,"pace":52,"shooting":26,"passing":41,"defense":66,"physical":78},{"name":"Joao Peglow","position":"MID","age":24,"overall":67,"potential":67,"pace":73,"shooting":65,"passing":62,"defense":43,"physical":48},{"name":"Caden Clark","position":"MID","age":22,"overall":66,"potential":66,"pace":77,"shooting":61,"passing":64,"defense":50,"physical":61},{"name":"Matti Peltola","position":"DEF","age":23,"overall":66,"potential":66,"pace":64,"shooting":34,"passing":56,"defense":68,"physical":67},{"name":"Brandon Servania","position":"MID","age":27,"overall":65,"potential":65,"pace":66,"shooting":50,"passing":61,"defense":63,"physical":66},{"name":"Alex Bono","position":"GK","age":31,"overall":64,"potential":64,"pace":62,"shooting":63,"passing":62,"defense":34,"physical":61},{"name":"Jackson Hopkins","position":"MID","age":21,"overall":62,"potential":67,"pace":65,"shooting":53,"passing":57,"defense":39,"physical":60},{"name":"Hosei Kijima","position":"MID","age":24,"overall":61,"potential":61,"pace":68,"shooting":54,"passing":57,"defense":50,"physical":59},{"name":"Jacob Murrell","position":"FWD","age":22,"overall":60,"potential":60,"pace":56,"shooting":60,"passing":43,"defense":25,"physical":61},{"name":"Jordan Farr","position":"GK","age":31,"overall":58,"potential":58,"pace":59,"shooting":58,"passing":60,"defense":22,"physical":61},{"name":"Conner Antley","position":"DEF","age":31,"overall":58,"potential":58,"pace":63,"shooting":31,"passing":44,"defense":59,"physical":58}]},"fc_cincinnati":{"name":"FC Cincinnati","players":[{"name":"Evander","position":"MID","age":28,"overall":79,"potential":79,"pace":72,"shooting":78,"passing":79,"defense":66,"physical":71},{"name":"Kevin Denkey","position":"FWD","age":25,"overall":76,"potential":76,"pace":75,"shooting":78,"passing":55,"defense":29,"physical":83},{"name":"Pavel Bucha","position":"MID","age":28,"overall":74,"potential":74,"pace":71,"shooting":70,"passing":72,"defense":69,"physical":71},{"name":"Obinna Nwobodo","position":"MID","age":29,"overall":73,"potential":73,"pace":82,"shooting":62,"passing":68,"defense":75,"physical":74},{"name":"Miles Robinson","position":"DEF","age":29,"overall":73,"potential":73,"pace":82,"shooting":35,"passing":55,"defense":72,"physical":79},{"name":"Matt Miazga","position":"DEF","age":30,"overall":73,"potential":73,"pace":46,"shooting":26,"passing":47,"defense":72,"physical":78},{"name":"Roman Celentano","position":"GK","age":25,"overall":72,"potential":72,"pace":72,"shooting":71,"passing":69,"defense":21,"physical":74},{"name":"Teenage Hadebe","position":"DEF","age":30,"overall":68,"potential":68,"pace":81,"shooting":32,"passing":48,"defense":68,"physical":74},{"name":"Ender Echenique","position":"MID","age":22,"overall":68,"potential":68,"pace":81,"shooting":66,"passing":53,"defense":24,"physical":45},{"name":"Nick Hagglund","position":"DEF","age":33,"overall":67,"potential":67,"pace":45,"shooting":29,"passing":59,"defense":67,"physical":66},{"name":"Alvas Powell","position":"DEF","age":31,"overall":66,"potential":66,"pace":92,"shooting":45,"passing":55,"defense":58,"physical":74},{"name":"Kyle Smith","position":"DEF","age":34,"overall":65,"potential":65,"pace":69,"shooting":26,"passing":50,"defense":63,"physical":73},{"name":"Ayoub Jabbari","position":"FWD","age":26,"overall":65,"potential":65,"pace":60,"shooting":63,"passing":53,"defense":27,"physical":69},{"name":"Tah Anunga","position":"MID","age":29,"overall":64,"potential":64,"pace":56,"shooting":50,"passing":61,"defense":62,"physical":71},{"name":"Gilberto Flores","position":"DEF","age":23,"overall":62,"potential":62,"pace":64,"shooting":37,"passing":45,"defense":61,"physical":63},{"name":"Tom Barlow","position":"FWD","age":31,"overall":61,"potential":61,"pace":76,"shooting":59,"passing":48,"defense":35,"physical":77},{"name":"Evan Louro","position":"GK","age":30,"overall":61,"potential":61,"pace":62,"shooting":61,"passing":62,"defense":35,"physical":62},{"name":"Gerardo Valenzuela","position":"MID","age":21,"overall":60,"potential":65,"pace":69,"shooting":51,"passing":57,"defense":42,"physical":60},{"name":"Kristian Fletcher","position":"MID","age":20,"overall":57,"potential":62,"pace":73,"shooting":57,"passing":47,"defense":25,"physical":53},{"name":"Stefan Chirila","position":"FWD","age":19,"overall":54,"potential":59,"pace":52,"shooting":58,"passing":40,"defense":26,"physical":44},{"name":"Stiven Jimenez","position":"MID","age":18,"overall":49,"potential":54,"pace":60,"shooting":34,"passing":45,"defense":48,"physical":45},{"name":"Kenji Mboma Dem","position":"FWD","age":24,"overall":49,"potential":49,"pace":54,"shooting":52,"passing":35,"defense":16,"physical":42}]},"fc_dallas":{"name":"FC Dallas","players":[{"name":"Petar Musa","position":"FWD","age":28,"overall":77,"potential":77,"pace":82,"shooting":75,"passing":62,"defense":41,"physical":81},{"name":"Herman Johansson","position":"DEF","age":28,"overall":73,"potential":73,"pace":93,"shooting":59,"passing":64,"defense":65,"physical":77},{"name":"Ramiro","position":"MID","age":33,"overall":70,"potential":70,"pace":67,"shooting":65,"passing":64,"defense":68,"physical":66},{"name":"Shaq Moore","position":"DEF","age":29,"overall":69,"potential":69,"pace":79,"shooting":56,"passing":60,"defense":62,"physical":74},{"name":"Osaze Urhoghide","position":"DEF","age":26,"overall":69,"potential":69,"pace":79,"shooting":35,"passing":45,"defense":68,"physical":74},{"name":"Joaquin Valiente","position":"MID","age":25,"overall":68,"potential":68,"pace":79,"shooting":64,"passing":66,"defense":48,"physical":55},{"name":"Anderson Julio","position":"FWD","age":30,"overall":67,"potential":67,"pace":86,"shooting":64,"passing":61,"defense":33,"physical":62},{"name":"Jonathan Sirois","position":"GK","age":25,"overall":66,"potential":66,"pace":68,"shooting":62,"passing":55,"defense":34,"physical":67},{"name":"Christian Cappis","position":"MID","age":26,"overall":66,"potential":66,"pace":74,"shooting":57,"passing":63,"defense":60,"physical":74},{"name":"Sebastien Ibeagha","position":"DEF","age":34,"overall":66,"potential":66,"pace":66,"shooting":26,"passing":46,"defense":64,"physical":75},{"name":"Patrickson Delgado","position":"MID","age":22,"overall":66,"potential":66,"pace":59,"shooting":54,"passing":58,"defense":59,"physical":62},{"name":"Lalas Abubakar","position":"DEF","age":31,"overall":65,"potential":65,"pace":52,"shooting":32,"passing":48,"defense":63,"physical":77},{"name":"Logan Farrington","position":"FWD","age":24,"overall":65,"potential":65,"pace":66,"shooting":63,"passing":47,"defense":22,"physical":67},{"name":"Don Deedson Louicius","position":"FWD","age":25,"overall":64,"potential":64,"pace":82,"shooting":62,"passing":54,"defense":22,"physical":57},{"name":"Bernard Kamungo","position":"MID","age":24,"overall":64,"potential":64,"pace":77,"shooting":59,"passing":56,"defense":45,"physical":52},{"name":"Michael Collodi","position":"GK","age":25,"overall":61,"potential":61,"pace":60,"shooting":61,"passing":56,"defense":28,"physical":63},{"name":"Nolan Norris","position":"DEF","age":21,"overall":57,"potential":62,"pace":67,"shooting":56,"passing":50,"defense":54,"physical":56},{"name":"Alvaro Augusto","position":"DEF","age":21,"overall":57,"potential":62,"pace":69,"shooting":24,"passing":39,"defense":56,"physical":66}]},"houston_dynamo_fc":{"name":"Houston Dynamo FC","players":[{"name":"Agustin Bouzat","position":"MID","age":32,"overall":75,"potential":75,"pace":78,"shooting":58,"passing":68,"defense":69,"physical":78},{"name":"Ezequiel Ponce","position":"FWD","age":29,"overall":73,"potential":73,"pace":74,"shooting":72,"passing":61,"defense":37,"physical":76},{"name":"Jack McGlynn","position":"MID","age":23,"overall":72,"potential":72,"pace":64,"shooting":64,"passing":75,"defense":57,"physical":61},{"name":"Ondrej Lingr","position":"MID","age":27,"overall":71,"potential":71,"pace":71,"shooting":69,"passing":68,"defense":52,"physical":76},{"name":"Artur","position":"MID","age":30,"overall":71,"potential":71,"pace":62,"shooting":43,"passing":63,"defense":68,"physical":75},{"name":"Antonio Carlos","position":"DEF","age":33,"overall":71,"potential":71,"pace":54,"shooting":34,"passing":43,"defense":71,"physical":81},{"name":"Erik Sviatchenko","position":"DEF","age":34,"overall":69,"potential":69,"pace":56,"shooting":49,"passing":58,"defense":67,"physical":78},{"name":"Franco Negri","position":"DEF","age":31,"overall":69,"potential":69,"pace":77,"shooting":59,"passing":66,"defense":64,"physical":67},{"name":"Felipe Andrade","position":"DEF","age":24,"overall":68,"potential":68,"pace":78,"shooting":48,"passing":55,"defense":67,"physical":69},{"name":"Duane Holmes","position":"MID","age":31,"overall":67,"potential":67,"pace":72,"shooting":63,"passing":64,"defense":58,"physical":57},{"name":"Jonathan Bond","position":"GK","age":33,"overall":67,"potential":67,"pace":67,"shooting":65,"passing":64,"defense":49,"physical":66},{"name":"Lawrence Ennali","position":"MID","age":24,"overall":67,"potential":67,"pace":90,"shooting":60,"passing":57,"defense":31,"physical":52},{"name":"Nicholas Markanich","position":"FWD","age":26,"overall":65,"potential":65,"pace":60,"shooting":66,"passing":54,"defense":27,"physical":60},{"name":"Jimmy Maurer","position":"GK","age":37,"overall":63,"potential":63,"pace":63,"shooting":62,"passing":63,"defense":26,"physical":66}]},"inter_miami_cf":{"name":"Inter Miami CF","players":[{"name":"Lionel Messi","position":"FWD","age":39,"overall":86,"potential":86,"pace":76,"shooting":84,"passing":84,"defense":33,"physical":64},{"name":"Rodrigo De Paul","position":"MID","age":32,"overall":83,"potential":83,"pace":75,"shooting":77,"passing":83,"defense":75,"physical":83},{"name":"Luis Suarez","position":"FWD","age":39,"overall":78,"potential":78,"pace":51,"shooting":81,"passing":74,"defense":41,"physical":75},{"name":"Dayne St. Clair","position":"GK","age":29,"overall":72,"potential":72,"pace":72,"shooting":68,"passing":60,"defense":27,"physical":71},{"name":"Tadeo Allende","position":"MID","age":27,"overall":72,"potential":72,"pace":83,"shooting":76,"passing":63,"defense":36,"physical":72},{"name":"Facundo Mura","position":"DEF","age":27,"overall":72,"potential":72,"pace":83,"shooting":63,"passing":66,"defense":65,"physical":71},{"name":"Telasco Segovia","position":"MID","age":23,"overall":70,"potential":70,"pace":71,"shooting":66,"passing":66,"defense":58,"physical":66},{"name":"Maximiliano Falcon","position":"DEF","age":29,"overall":69,"potential":69,"pace":73,"shooting":42,"passing":37,"defense":67,"physical":86},{"name":"Oscar Ustari","position":"GK","age":40,"overall":69,"potential":69,"pace":68,"shooting":71,"passing":68,"defense":63,"physical":72},{"name":"Yannick Bright","position":"MID","age":24,"overall":69,"potential":69,"pace":70,"shooting":36,"passing":61,"defense":68,"physical":62},{"name":"Gonzalo Lujan","position":"DEF","age":25,"overall":68,"potential":68,"pace":62,"shooting":34,"passing":56,"defense":67,"physical":76},{"name":"Noah Allen","position":"DEF","age":22,"overall":68,"potential":68,"pace":78,"shooting":40,"passing":59,"defense":66,"physical":66},{"name":"Luis Barraza","position":"GK","age":29,"overall":66,"potential":66,"pace":66,"shooting":63,"passing":71,"defense":27,"physical":65},{"name":"Ian Fray","position":"DEF","age":23,"overall":65,"potential":65,"pace":74,"shooting":41,"passing":54,"defense":64,"physical":64},{"name":"David Ruiz","position":"MID","age":22,"overall":64,"potential":64,"pace":68,"shooting":49,"passing":60,"defense":61,"physical":57},{"name":"Allen Obando","position":"FWD","age":24,"overall":64,"potential":64,"pace":66,"shooting":61,"passing":49,"defense":28,"physical":66},{"name":"Rocco Rios Novo","position":"GK","age":24,"overall":64,"potential":64,"pace":62,"shooting":60,"passing":61,"defense":24,"physical":64},{"name":"Santiago Morales","position":"MID","age":19,"overall":57,"potential":62,"pace":64,"shooting":46,"passing":55,"defense":35,"physical":49},{"name":"Tyler Hall","position":"DEF","age":24,"overall":57,"potential":57,"pace":57,"shooting":28,"passing":53,"defense":58,"physical":52},{"name":"Israel Boatwright","position":"DEF","age":24,"overall":57,"potential":57,"pace":70,"shooting":22,"passing":33,"defense":55,"physical":50}]},"la_galaxy":{"name":"LA Galaxy","players":[{"name":"Riqui Puig","position":"MID","age":26,"overall":79,"potential":79,"pace":72,"shooting":71,"passing":79,"defense":50,"physical":50},{"name":"Marco Reus","position":"MID","age":37,"overall":78,"potential":78,"pace":53,"shooting":81,"passing":81,"defense":52,"physical":61},{"name":"Joseph Paintsil","position":"MID","age":28,"overall":75,"potential":75,"pace":91,"shooting":70,"passing":66,"defense":35,"physical":66},{"name":"Gabriel Pec","position":"MID","age":25,"overall":75,"potential":75,"pace":87,"shooting":68,"passing":66,"defense":34,"physical":70},{"name":"Erik Thommy","position":"MID","age":31,"overall":72,"potential":72,"pace":75,"shooting":68,"passing":72,"defense":50,"physical":52},{"name":"Jakob Glesnes","position":"DEF","age":32,"overall":72,"potential":72,"pace":52,"shooting":55,"passing":56,"defense":73,"physical":79},{"name":"Klauss","position":"FWD","age":29,"overall":72,"potential":72,"pace":64,"shooting":73,"passing":62,"defense":36,"physical":86},{"name":"Miki Yamane","position":"DEF","age":32,"overall":71,"potential":71,"pace":74,"shooting":61,"passing":65,"defense":67,"physical":71},{"name":"Maya Yoshida","position":"DEF","age":37,"overall":68,"potential":68,"pace":46,"shooting":41,"passing":54,"defense":67,"physical":74},{"name":"Lucas Sanabria","position":"MID","age":22,"overall":68,"potential":68,"pace":63,"shooting":56,"passing":63,"defense":65,"physical":65},{"name":"Emiro Garces","position":"DEF","age":24,"overall":68,"potential":68,"pace":89,"shooting":35,"passing":47,"defense":67,"physical":74},{"name":"Edwin Cerrillo","position":"MID","age":25,"overall":68,"potential":68,"pace":63,"shooting":47,"passing":60,"defense":63,"physical":70},{"name":"Julian Aude","position":"DEF","age":23,"overall":67,"potential":67,"pace":72,"shooting":46,"passing":63,"defense":62,"physical":62},{"name":"Justin Haak","position":"DEF","age":24,"overall":67,"potential":67,"pace":56,"shooting":41,"passing":60,"defense":66,"physical":69},{"name":"John Nelson","position":"DEF","age":28,"overall":66,"potential":66,"pace":81,"shooting":27,"passing":48,"defense":61,"physical":62},{"name":"JT Marcinkowski","position":"GK","age":29,"overall":65,"potential":65,"pace":66,"shooting":63,"passing":68,"defense":22,"physical":65},{"name":"Mauricio Cuevas","position":"DEF","age":24,"overall":65,"potential":65,"pace":74,"shooting":45,"passing":62,"defense":60,"physical":50},{"name":"Novak Micovic","position":"GK","age":24,"overall":64,"potential":64,"pace":63,"shooting":63,"passing":64,"defense":25,"physical":63},{"name":"Matheus Nascimento","position":"FWD","age":24,"overall":64,"potential":64,"pace":58,"shooting":65,"passing":50,"defense":27,"physical":61},{"name":"Isaiah Parente","position":"MID","age":26,"overall":63,"potential":63,"pace":56,"shooting":53,"passing":63,"defense":61,"physical":52},{"name":"Eriq Zavaleta","position":"DEF","age":24,"overall":62,"potential":62,"pace":40,"shooting":46,"passing":50,"defense":59,"physical":73},{"name":"Brady Scott","position":"GK","age":27,"overall":61,"potential":61,"pace":64,"shooting":64,"passing":60,"defense":32,"physical":64},{"name":"Tucker Lepley","position":"MID","age":24,"overall":60,"potential":60,"pace":70,"shooting":58,"passing":58,"defense":56,"physical":50},{"name":"Elijah Wynder","position":"MID","age":23,"overall":60,"potential":60,"pace":56,"shooting":52,"passing":57,"defense":53,"physical":59},{"name":"Harbor Miller","position":"DEF","age":19,"overall":58,"potential":63,"pace":68,"shooting":35,"passing":53,"defense":54,"physical":46},{"name":"Ruben Ramos Jr","position":"MID","age":19,"overall":53,"potential":58,"pace":59,"shooting":37,"passing":52,"defense":37,"physical":46}]},"los_angeles_fc":{"name":"Los Angeles FC","players":[{"name":"Heung Min Son","position":"FWD","age":34,"overall":84,"potential":84,"pace":83,"shooting":84,"passing":81,"defense":42,"physical":73},{"name":"Denis Bouanga","position":"FWD","age":31,"overall":80,"potential":80,"pace":85,"shooting":81,"passing":71,"defense":38,"physical":79},{"name":"Hugo Lloris","position":"GK","age":39,"overall":75,"potential":75,"pace":74,"shooting":75,"passing":69,"defense":51,"physical":76},{"name":"Ryan Hollingshead","position":"DEF","age":35,"overall":72,"potential":72,"pace":60,"shooting":66,"passing":67,"defense":71,"physical":81},{"name":"Mark Delgado","position":"MID","age":31,"overall":72,"potential":72,"pace":67,"shooting":58,"passing":68,"defense":68,"physical":70},{"name":"Timothy Tillman","position":"MID","age":27,"overall":71,"potential":71,"pace":75,"shooting":59,"passing":68,"defense":56,"physical":70},{"name":"Aaron Long","position":"DEF","age":33,"overall":71,"potential":71,"pace":78,"shooting":40,"passing":55,"defense":69,"physical":79},{"name":"Ryan Porteous","position":"DEF","age":27,"overall":71,"potential":71,"pace":65,"shooting":42,"passing":63,"defense":69,"physical":80},{"name":"Sergi Palencia","position":"DEF","age":30,"overall":70,"potential":70,"pace":78,"shooting":56,"passing":62,"defense":65,"physical":72},{"name":"Amin Boudri","position":"MID","age":21,"overall":70,"potential":75,"pace":69,"shooting":67,"passing":66,"defense":59,"physical":66},{"name":"Jeremy Ebobisse","position":"FWD","age":29,"overall":68,"potential":68,"pace":71,"shooting":66,"passing":61,"defense":34,"physical":70},{"name":"Eddie Segura","position":"DEF","age":29,"overall":68,"potential":68,"pace":59,"shooting":30,"passing":47,"defense":67,"physical":73},{"name":"Nkosi Tafari","position":"DEF","age":29,"overall":68,"potential":68,"pace":70,"shooting":36,"passing":47,"defense":68,"physical":75},{"name":"David Martinez","position":"FWD","age":20,"overall":68,"potential":73,"pace":80,"shooting":64,"passing":55,"defense":26,"physical":44},{"name":"Jacob Shaffelburg","position":"MID","age":26,"overall":67,"potential":67,"pace":90,"shooting":63,"passing":60,"defense":52,"physical":63},{"name":"Mathieu Choiniere","position":"MID","age":27,"overall":67,"potential":67,"pace":60,"shooting":58,"passing":66,"defense":62,"physical":59},{"name":"Tyler Boyd","position":"MID","age":31,"overall":66,"potential":66,"pace":78,"shooting":66,"passing":59,"defense":48,"physical":64},{"name":"Nathan Ordaz","position":"FWD","age":22,"overall":66,"potential":66,"pace":70,"shooting":65,"passing":48,"defense":21,"physical":53},{"name":"Ryan Raposo","position":"MID","age":27,"overall":63,"potential":63,"pace":66,"shooting":58,"passing":61,"defense":55,"physical":50},{"name":"Thomas Hasal","position":"GK","age":27,"overall":62,"potential":62,"pace":62,"shooting":60,"passing":58,"defense":27,"physical":60},{"name":"Artem Smolyakov","position":"DEF","age":23,"overall":62,"potential":62,"pace":66,"shooting":43,"passing":61,"defense":56,"physical":57},{"name":"Kenny Nielsen","position":"DEF","age":24,"overall":53,"potential":53,"pace":64,"shooting":25,"passing":41,"defense":56,"physical":53}]},"minnesota_united_fc":{"name":"Minnesota United FC","players":[{"name":"Joaquin Pereyra","position":"MID","age":27,"overall":75,"potential":75,"pace":67,"shooting":67,"passing":76,"defense":63,"physical":66},{"name":"Tomas Chancalay","position":"MID","age":27,"overall":73,"potential":73,"pace":83,"shooting":72,"passing":69,"defense":40,"physical":62},{"name":"Kelvin Yeboah","position":"FWD","age":26,"overall":71,"potential":71,"pace":86,"shooting":70,"passing":57,"defense":24,"physical":71},{"name":"Michael Boxall","position":"DEF","age":37,"overall":71,"potential":71,"pace":52,"shooting":43,"passing":60,"defense":71,"physical":80},{"name":"Bongokuhle Hlongwane","position":"DEF","age":26,"overall":70,"potential":70,"pace":80,"shooting":67,"passing":59,"defense":65,"physical":70},{"name":"Julian Gressel","position":"MID","age":32,"overall":69,"potential":69,"pace":59,"shooting":63,"passing":72,"defense":59,"physical":70},{"name":"Wil Trapp","position":"MID","age":33,"overall":69,"potential":69,"pace":48,"shooting":50,"passing":65,"defense":64,"physical":66},{"name":"Nicolas Romero","position":"DEF","age":22,"overall":69,"potential":69,"pace":60,"shooting":45,"passing":55,"defense":69,"physical":71},{"name":"Owen Gene","position":"MID","age":23,"overall":68,"potential":68,"pace":69,"shooting":49,"passing":63,"defense":66,"physical":67},{"name":"Jefferson Diaz","position":"DEF","age":25,"overall":67,"potential":67,"pace":64,"shooting":41,"passing":59,"defense":69,"physical":71},{"name":"Anthony Markanich","position":"DEF","age":26,"overall":67,"potential":67,"pace":72,"shooting":59,"passing":54,"defense":66,"physical":61},{"name":"Peter Stroud","position":"MID","age":24,"overall":66,"potential":66,"pace":74,"shooting":42,"passing":61,"defense":63,"physical":62},{"name":"Carlos Harvey","position":"DEF","age":26,"overall":66,"potential":66,"pace":53,"shooting":42,"passing":54,"defense":65,"physical":73},{"name":"Drake Callender","position":"GK","age":28,"overall":65,"potential":65,"pace":64,"shooting":66,"passing":63,"defense":25,"physical":63},{"name":"Morris Duggan","position":"DEF","age":25,"overall":64,"potential":64,"pace":66,"shooting":31,"passing":48,"defense":64,"physical":70},{"name":"D.J. Taylor","position":"DEF","age":28,"overall":63,"potential":63,"pace":70,"shooting":30,"passing":50,"defense":59,"physical":71},{"name":"Devin Padelford","position":"DEF","age":23,"overall":62,"potential":62,"pace":71,"shooting":31,"passing":48,"defense":64,"physical":61},{"name":"Alec Smir","position":"GK","age":27,"overall":52,"potential":52,"pace":58,"shooting":52,"passing":59,"defense":22,"physical":51}]},"nashville_sc":{"name":"Nashville SC","players":[{"name":"Hany Mukhtar","position":"MID","age":31,"overall":79,"potential":79,"pace":82,"shooting":73,"passing":77,"defense":44,"physical":62},{"name":"Cristian Espinoza","position":"MID","age":31,"overall":75,"potential":75,"pace":82,"shooting":69,"passing":71,"defense":42,"physical":65},{"name":"Sam Surridge","position":"FWD","age":27,"overall":74,"potential":74,"pace":64,"shooting":76,"passing":56,"defense":28,"physical":72},{"name":"Andy Najar","position":"DEF","age":33,"overall":72,"potential":72,"pace":71,"shooting":63,"passing":69,"defense":71,"physical":66},{"name":"Maxwell Woledzi","position":"DEF","age":25,"overall":71,"potential":71,"pace":68,"shooting":38,"passing":54,"defense":70,"physical":80},{"name":"Bryan Acosta","position":"MID","age":32,"overall":69,"potential":69,"pace":70,"shooting":66,"passing":68,"defense":65,"physical":78},{"name":"Joe Willis","position":"GK","age":37,"overall":69,"potential":69,"pace":70,"shooting":69,"passing":64,"defense":47,"physical":70},{"name":"Alex Muyl","position":"MID","age":30,"overall":68,"potential":68,"pace":78,"shooting":59,"passing":62,"defense":63,"physical":80},{"name":"Daniel Lovitz","position":"DEF","age":34,"overall":68,"potential":68,"pace":74,"shooting":53,"passing":65,"defense":64,"physical":70},{"name":"Edvard Tagseth","position":"MID","age":25,"overall":67,"potential":67,"pace":79,"shooting":60,"passing":64,"defense":61,"physical":66},{"name":"Jeison Palacios","position":"DEF","age":32,"overall":67,"potential":67,"pace":54,"shooting":25,"passing":48,"defense":67,"physical":72},{"name":"Patrick Yazbek","position":"MID","age":24,"overall":66,"potential":66,"pace":68,"shooting":54,"passing":62,"defense":62,"physical":73},{"name":"Ahmed Qasem","position":"FWD","age":23,"overall":66,"potential":66,"pace":72,"shooting":61,"passing":62,"defense":39,"physical":58},{"name":"Jack Maher","position":"DEF","age":26,"overall":65,"potential":65,"pace":53,"shooting":24,"passing":47,"defense":66,"physical":69},{"name":"Josh Bauer","position":"DEF","age":27,"overall":64,"potential":64,"pace":55,"shooting":30,"passing":47,"defense":63,"physical":71},{"name":"Brian Schwake","position":"GK","age":24,"overall":63,"potential":63,"pace":66,"shooting":60,"passing":58,"defense":20,"physical":60},{"name":"Reed Baker-Whiting","position":"DEF","age":21,"overall":60,"potential":65,"pace":74,"shooting":57,"passing":55,"defense":53,"physical":62},{"name":"Shakur Mohammed","position":"MID","age":22,"overall":59,"potential":59,"pace":76,"shooting":59,"passing":53,"defense":24,"physical":49},{"name":"Christopher Applewhite","position":"DEF","age":18,"overall":58,"potential":63,"pace":64,"shooting":31,"passing":45,"defense":58,"physical":63},{"name":"Xavier Valdez","position":"GK","age":22,"overall":54,"potential":54,"pace":58,"shooting":53,"passing":54,"defense":27,"physical":52},{"name":"Thomas Williams","position":"DEF","age":21,"overall":53,"potential":58,"pace":54,"shooting":31,"passing":37,"defense":52,"physical":65}]},"new_england_revolution":{"name":"New England Revolution","players":[{"name":"Carles Gil","position":"MID","age":33,"overall":79,"potential":79,"pace":70,"shooting":71,"passing":80,"defense":38,"physical":62},{"name":"Matt Turner","position":"GK","age":31,"overall":74,"potential":74,"pace":74,"shooting":72,"passing":67,"defense":40,"physical":73},{"name":"Alhassan Yusuf","position":"MID","age":25,"overall":72,"potential":72,"pace":76,"shooting":59,"passing":67,"defense":67,"physical":76},{"name":"Ignatius Ganago","position":"FWD","age":27,"overall":72,"potential":72,"pace":80,"shooting":71,"passing":61,"defense":34,"physical":65},{"name":"Leonardo Campana","position":"FWD","age":25,"overall":72,"potential":72,"pace":65,"shooting":72,"passing":48,"defense":31,"physical":71},{"name":"Luca Langoni","position":"MID","age":24,"overall":71,"potential":71,"pace":90,"shooting":66,"passing":61,"defense":34,"physical":67},{"name":"Brandon Bye","position":"DEF","age":29,"overall":70,"potential":70,"pace":76,"shooting":58,"passing":61,"defense":66,"physical":72},{"name":"Mamadou Fofana","position":"DEF","age":24,"overall":70,"potential":70,"pace":65,"shooting":33,"passing":54,"defense":69,"physical":77},{"name":"Jackson Yueill","position":"MID","age":28,"overall":69,"potential":69,"pace":59,"shooting":61,"passing":67,"defense":64,"physical":73},{"name":"Matt Polster","position":"MID","age":32,"overall":68,"potential":68,"pace":44,"shooting":46,"passing":64,"defense":63,"physical":77},{"name":"Brayan Ceballos","position":"DEF","age":23,"overall":68,"potential":68,"pace":64,"shooting":26,"passing":50,"defense":69,"physical":71},{"name":"Aljaz Ivacic","position":"GK","age":32,"overall":67,"potential":67,"pace":69,"shooting":65,"passing":62,"defense":39,"physical":64},{"name":"Andrew Farrell","position":"DEF","age":34,"overall":66,"potential":66,"pace":68,"shooting":46,"passing":60,"defense":64,"physical":77},{"name":"Tanner Beason","position":"DEF","age":27,"overall":64,"potential":64,"pace":60,"shooting":25,"passing":42,"defense":64,"physical":70},{"name":"Will Sands","position":"MID","age":24,"overall":63,"potential":63,"pace":73,"shooting":49,"passing":55,"defense":57,"physical":61},{"name":"Peyton Miller","position":"DEF","age":21,"overall":62,"potential":67,"pace":75,"shooting":56,"passing":60,"defense":57,"physical":56},{"name":"Ilay Feingold","position":"DEF","age":23,"overall":62,"potential":62,"pace":63,"shooting":50,"passing":60,"defense":59,"physical":59},{"name":"Wyatt Omsberg","position":"DEF","age":29,"overall":62,"potential":62,"pace":36,"shooting":24,"passing":40,"defense":63,"physical":70},{"name":"Malcolm Fry","position":"FWD","age":21,"overall":57,"potential":62,"pace":65,"shooting":57,"passing":53,"defense":27,"physical":56},{"name":"Eric Klein","position":"DEF","age":19,"overall":53,"potential":58,"pace":60,"shooting":31,"passing":41,"defense":54,"physical":55}]},"new_york_city_fc":{"name":"New York City FC","players":[{"name":"Nicolas Fernandez","position":"MID","age":26,"overall":75,"potential":75,"pace":84,"shooting":70,"passing":70,"defense":60,"physical":68},{"name":"Maxi Moralez","position":"MID","age":39,"overall":72,"potential":72,"pace":59,"shooting":68,"passing":72,"defense":52,"physical":48},{"name":"Keaton Parks","position":"MID","age":28,"overall":72,"potential":72,"pace":34,"shooting":62,"passing":68,"defense":68,"physical":74},{"name":"Hannes Wolf","position":"MID","age":27,"overall":71,"potential":71,"pace":77,"shooting":68,"passing":67,"defense":37,"physical":68},{"name":"Thiago Martins","position":"DEF","age":31,"overall":71,"potential":71,"pace":71,"shooting":41,"passing":56,"defense":71,"physical":74},{"name":"Raul Gustavo","position":"DEF","age":27,"overall":71,"potential":71,"pace":66,"shooting":41,"passing":52,"defense":72,"physical":70},{"name":"Aiden O'Neill","position":"MID","age":28,"overall":70,"potential":70,"pace":76,"shooting":61,"passing":65,"defense":66,"physical":77},{"name":"Agustin Ojeda","position":"MID","age":22,"overall":70,"potential":70,"pace":88,"shooting":56,"passing":63,"defense":41,"physical":48},{"name":"Matt Freese","position":"GK","age":27,"overall":69,"potential":69,"pace":70,"shooting":68,"passing":68,"defense":29,"physical":69},{"name":"Tayvon Gray","position":"DEF","age":23,"overall":66,"potential":66,"pace":78,"shooting":30,"passing":59,"defense":62,"physical":64},{"name":"Andres Perea","position":"MID","age":25,"overall":65,"potential":65,"pace":72,"shooting":50,"passing":59,"defense":63,"physical":68},{"name":"Kevin O'Toole","position":"DEF","age":27,"overall":64,"potential":64,"pace":73,"shooting":53,"passing":56,"defense":60,"physical":62},{"name":"Tomas Romero","position":"GK","age":25,"overall":60,"potential":60,"pace":63,"shooting":59,"passing":60,"defense":28,"physical":59},{"name":"Greg Ranjitsingh","position":"GK","age":32,"overall":60,"potential":60,"pace":58,"shooting":51,"passing":50,"defense":21,"physical":60},{"name":"Nico Cavallo","position":"DEF","age":24,"overall":57,"potential":57,"pace":69,"shooting":39,"passing":49,"defense":53,"physical":62},{"name":"Malachi Jones","position":"FWD","age":22,"overall":57,"potential":57,"pace":77,"shooting":55,"passing":48,"defense":27,"physical":44},{"name":"Jonathan Shore","position":"MID","age":19,"overall":56,"potential":61,"pace":58,"shooting":50,"passing":54,"defense":53,"physical":49},{"name":"Maximo Carrizo","position":"MID","age":18,"overall":55,"potential":60,"pace":78,"shooting":45,"passing":51,"defense":23,"physical":38},{"name":"Drew Baiera","position":"DEF","age":19,"overall":51,"potential":56,"pace":61,"shooting":28,"passing":33,"defense":48,"physical":47}]},"seattle_sounders_fc":{"name":"Seattle Sounders FC","players":[{"name":"Albert Rusnak","position":"MID","age":32,"overall":75,"potential":75,"pace":71,"shooting":74,"passing":74,"defense":49,"physical":64},{"name":"Cristian Roldan","position":"MID","age":31,"overall":75,"potential":75,"pace":76,"shooting":64,"passing":67,"defense":77,"physical":77},{"name":"Yeimar Gomez Andrade","position":"DEF","age":34,"overall":74,"potential":74,"pace":63,"shooting":33,"passing":48,"defense":74,"physical":81},{"name":"Pedro De la Vega","position":"MID","age":24,"overall":73,"potential":73,"pace":81,"shooting":73,"passing":67,"defense":50,"physical":70},{"name":"Jesus Ferreira","position":"FWD","age":25,"overall":73,"potential":73,"pace":78,"shooting":68,"passing":70,"defense":46,"physical":64},{"name":"Jackson Ragen","position":"DEF","age":27,"overall":72,"potential":72,"pace":48,"shooting":25,"passing":55,"defense":70,"physical":81},{"name":"Jordan Morris","position":"FWD","age":31,"overall":71,"potential":71,"pace":78,"shooting":68,"passing":60,"defense":39,"physical":77},{"name":"Nouhou Tolo","position":"DEF","age":29,"overall":71,"potential":71,"pace":83,"shooting":36,"passing":53,"defense":68,"physical":80},{"name":"Stefan Frei","position":"GK","age":40,"overall":70,"potential":70,"pace":68,"shooting":68,"passing":67,"defense":29,"physical":74},{"name":"Alex Roldan","position":"DEF","age":29,"overall":70,"potential":70,"pace":75,"shooting":58,"passing":67,"defense":64,"physical":71},{"name":"Joao Paulo","position":"MID","age":31,"overall":70,"potential":70,"pace":57,"shooting":64,"passing":70,"defense":68,"physical":70},{"name":"Paul Arriola","position":"MID","age":31,"overall":68,"potential":68,"pace":73,"shooting":64,"passing":65,"defense":61,"physical":71},{"name":"Paul Rothrock","position":"MID","age":27,"overall":68,"potential":68,"pace":85,"shooting":59,"passing":56,"defense":44,"physical":61},{"name":"Kim Kee Hee","position":"DEF","age":37,"overall":66,"potential":66,"pace":49,"shooting":43,"passing":56,"defense":67,"physical":72},{"name":"Hassani Dotson","position":"MID","age":28,"overall":66,"potential":66,"pace":65,"shooting":61,"passing":61,"defense":65,"physical":67},{"name":"Andrew Thomas","position":"GK","age":27,"overall":66,"potential":66,"pace":69,"shooting":65,"passing":62,"defense":51,"physical":66},{"name":"Danny Musovski","position":"FWD","age":30,"overall":65,"potential":65,"pace":64,"shooting":64,"passing":51,"defense":43,"physical":65},{"name":"Kalani Kossa-Rienzi","position":"DEF","age":24,"overall":64,"potential":64,"pace":78,"shooting":50,"passing":57,"defense":59,"physical":63},{"name":"Nikola Petkovic","position":"MID","age":23,"overall":63,"potential":63,"pace":54,"shooting":50,"passing":60,"defense":61,"physical":59},{"name":"Ryan Sailor","position":"DEF","age":24,"overall":62,"potential":62,"pace":62,"shooting":24,"passing":34,"defense":64,"physical":67},{"name":"Max Anchor","position":"GK","age":21,"overall":51,"potential":56,"pace":50,"shooting":50,"passing":52,"defense":20,"physical":50},{"name":"Stuart Hawkins","position":"DEF","age":19,"overall":55,"potential":60,"pace":53,"shooting":28,"passing":46,"defense":55,"physical":59}]},"new_york_red_bulls":{"name":"New York Red Bulls","players":[{"name":"Emil Forsberg","position":"MID","age":34,"overall":79,"potential":79,"pace":64,"shooting":73,"passing":81,"defense":35,"physical":61},{"name":"Eric Maxim Choupo-Moting","position":"FWD","age":37,"overall":75,"potential":75,"pace":60,"shooting":73,"passing":68,"defense":38,"physical":70},{"name":"Carlos Miguel Coronel","position":"GK","age":29,"overall":72,"potential":72,"pace":71,"shooting":70,"passing":73,"defense":39,"physical":71},{"name":"Alexander Hack","position":"DEF","age":32,"overall":71,"potential":71,"pace":54,"shooting":38,"passing":59,"defense":72,"physical":76},{"name":"Sean Nealis","position":"DEF","age":28,"overall":70,"potential":70,"pace":67,"shooting":32,"passing":39,"defense":69,"physical":84},{"name":"John McCarthy","position":"GK","age":33,"overall":68,"potential":68,"pace":69,"shooting":69,"passing":58,"defense":35,"physical":65},{"name":"Kyle Duncan","position":"DEF","age":28,"overall":67,"potential":67,"pace":83,"shooting":44,"passing":51,"defense":63,"physical":71},{"name":"Noah Eile","position":"DEF","age":23,"overall":67,"potential":67,"pace":73,"shooting":26,"passing":47,"defense":64,"physical":74},{"name":"Tim Parker","position":"DEF","age":32,"overall":67,"potential":67,"pace":64,"shooting":31,"passing":44,"defense":65,"physical":79},{"name":"Dylan Nealis","position":"DEF","age":27,"overall":66,"potential":66,"pace":72,"shooting":43,"passing":52,"defense":67,"physical":69},{"name":"Marcelo Morales","position":"DEF","age":22,"overall":66,"potential":66,"pace":73,"shooting":29,"passing":52,"defense":58,"physical":70},{"name":"Juan Jose Mina","position":"DEF","age":21,"overall":64,"potential":64,"pace":72,"shooting":40,"passing":52,"defense":60,"physical":61},{"name":"AJ Marcucci","position":"GK","age":26,"overall":53,"potential":53,"pace":54,"shooting":57,"passing":50,"defense":22,"physical":51},{"name":"Aidan Stokes","position":"GK","age":17,"overall":52,"potential":62,"pace":59,"shooting":47,"passing":46,"defense":25,"physical":54}]},"orlando_city_sc":{"name":"Orlando City SC","players":[{"name":"Martin Ojeda","position":"MID","age":26,"overall":76,"potential":76,"pace":83,"shooting":75,"passing":76,"defense":34,"physical":63},{"name":"Luis Muriel","position":"FWD","age":34,"overall":75,"potential":75,"pace":69,"shooting":77,"passing":73,"defense":29,"physical":65},{"name":"Eduard Atuesta","position":"MID","age":28,"overall":73,"potential":73,"pace":65,"shooting":57,"passing":74,"defense":64,"physical":71},{"name":"Marco Pasalic","position":"MID","age":27,"overall":72,"potential":72,"pace":76,"shooting":75,"passing":67,"defense":35,"physical":56},{"name":"Adrian Marin","position":"DEF","age":29,"overall":70,"potential":70,"pace":71,"shooting":48,"passing":63,"defense":68,"physical":71},{"name":"Griffin Dorsey","position":"DEF","age":27,"overall":70,"potential":70,"pace":79,"shooting":57,"passing":67,"defense":62,"physical":76},{"name":"David Brekalo","position":"DEF","age":27,"overall":70,"potential":70,"pace":73,"shooting":27,"passing":54,"defense":69,"physical":81},{"name":"Robin Jansson","position":"DEF","age":34,"overall":70,"potential":70,"pace":48,"shooting":28,"passing":53,"defense":71,"physical":75},{"name":"Braian Ojeda","position":"MID","age":25,"overall":69,"potential":69,"pace":67,"shooting":54,"passing":63,"defense":64,"physical":73},{"name":"Maxime Crepeau","position":"GK","age":32,"overall":69,"potential":69,"pace":70,"shooting":69,"passing":64,"defense":45,"physical":66},{"name":"Ivan Angulo","position":"MID","age":27,"overall":69,"potential":69,"pace":86,"shooting":60,"passing":61,"defense":40,"physical":53},{"name":"Wilder Cartagena","position":"MID","age":31,"overall":68,"potential":68,"pace":73,"shooting":54,"passing":59,"defense":66,"physical":75},{"name":"Duncan McGuire","position":"FWD","age":24,"overall":68,"potential":68,"pace":65,"shooting":65,"passing":43,"defense":25,"physical":67},{"name":"Rodrigo Schlegel","position":"DEF","age":29,"overall":65,"potential":65,"pace":48,"shooting":32,"passing":39,"defense":65,"physical":77},{"name":"Tyrese Spicer","position":"MID","age":24,"overall":65,"potential":65,"pace":82,"shooting":60,"passing":55,"defense":40,"physical":51},{"name":"Carlos Mercado","position":"GK","age":26,"overall":56,"potential":56,"pace":59,"shooting":58,"passing":48,"defense":26,"physical":53},{"name":"Javier Otero","position":"GK","age":23,"overall":55,"potential":55,"pace":56,"shooting":53,"passing":52,"defense":25,"physical":54},{"name":"Tahir Reid-Brown","position":"DEF","age":20,"overall":53,"potential":58,"pace":78,"shooting":28,"passing":38,"defense":47,"physical":50},{"name":"Gustavo Caraballo","position":"MID","age":17,"overall":50,"potential":62,"pace":61,"shooting":46,"passing":43,"defense":21,"physical":39}]},"philadelphia_union":{"name":"Philadelphia Union","players":[{"name":"Kai Wagner","position":"DEF","age":30,"overall":75,"potential":75,"pace":78,"shooting":50,"passing":70,"defense":70,"physical":79},{"name":"Andre Blake","position":"GK","age":35,"overall":75,"potential":75,"pace":74,"shooting":70,"passing":71,"defense":45,"physical":78},{"name":"Mikael Uhre","position":"FWD","age":31,"overall":72,"potential":72,"pace":84,"shooting":69,"passing":52,"defense":37,"physical":77},{"name":"Danley Jean Jacques","position":"MID","age":26,"overall":70,"potential":70,"pace":69,"shooting":56,"passing":66,"defense":67,"physical":74},{"name":"Bruno Damiani","position":"FWD","age":24,"overall":70,"potential":70,"pace":66,"shooting":70,"passing":56,"defense":32,"physical":74},{"name":"Alejandro Bedoya","position":"MID","age":39,"overall":69,"potential":69,"pace":53,"shooting":65,"passing":69,"defense":65,"physical":66},{"name":"Indiana Vassilev","position":"MID","age":21,"overall":68,"potential":73,"pace":73,"shooting":62,"passing":64,"defense":64,"physical":67},{"name":"Olivier Mbaizo","position":"DEF","age":28,"overall":68,"potential":68,"pace":80,"shooting":36,"passing":58,"defense":63,"physical":65},{"name":"Quinn Sullivan","position":"MID","age":21,"overall":67,"potential":72,"pace":76,"shooting":65,"passing":65,"defense":49,"physical":57},{"name":"Nathan Harriel","position":"DEF","age":23,"overall":67,"potential":67,"pace":78,"shooting":32,"passing":52,"defense":65,"physical":75},{"name":"Jovan Lukic","position":"MID","age":24,"overall":66,"potential":66,"pace":76,"shooting":62,"passing":64,"defense":59,"physical":60},{"name":"Jesus Bueno","position":"MID","age":27,"overall":65,"potential":65,"pace":58,"shooting":55,"passing":63,"defense":65,"physical":66},{"name":"Ben Bender","position":"MID","age":25,"overall":62,"potential":62,"pace":64,"shooting":59,"passing":62,"defense":42,"physical":59},{"name":"George Marks","position":"GK","age":26,"overall":61,"potential":61,"pace":62,"shooting":64,"passing":64,"defense":27,"physical":63},{"name":"Jeremy Rafanello","position":"MID","age":26,"overall":60,"potential":60,"pace":62,"shooting":59,"passing":56,"defense":29,"physical":57},{"name":"Andrew Rick","position":"GK","age":19,"overall":50,"potential":60,"pace":49,"shooting":47,"passing":57,"defense":31,"physical":43}]},"portland_timbers":{"name":"Portland Timbers","players":[{"name":"Jonathan Rodriguez","position":"MID","age":32,"overall":76,"potential":76,"pace":85,"shooting":76,"passing":67,"defense":38,"physical":75},{"name":"David da Costa","position":"MID","age":25,"overall":75,"potential":75,"pace":76,"shooting":68,"passing":73,"defense":34,"physical":47},{"name":"Matias Rojas","position":"FWD","age":28,"overall":74,"potential":74,"pace":70,"shooting":77,"passing":74,"defense":56,"physical":63},{"name":"Felipe Carballo","position":"MID","age":29,"overall":73,"potential":73,"pace":69,"shooting":68,"passing":70,"defense":66,"physical":72},{"name":"Joao Ortiz","position":"MID","age":30,"overall":71,"potential":71,"pace":72,"shooting":68,"passing":67,"defense":68,"physical":75},{"name":"Kamal Miller","position":"DEF","age":27,"overall":71,"potential":71,"pace":75,"shooting":48,"passing":59,"defense":68,"physical":81},{"name":"Antony","position":"MID","age":24,"overall":71,"potential":74,"pace":89,"shooting":59,"passing":64,"defense":40,"physical":57},{"name":"Felipe Mora","position":"FWD","age":32,"overall":71,"potential":71,"pace":71,"shooting":71,"passing":55,"defense":26,"physical":61},{"name":"Diego Chara","position":"MID","age":40,"overall":70,"potential":70,"pace":68,"shooting":52,"passing":61,"defense":69,"physical":73},{"name":"Jimer Fory","position":"DEF","age":26,"overall":69,"potential":69,"pace":75,"shooting":50,"passing":63,"defense":63,"physical":73},{"name":"David Ayala","position":"MID","age":27,"overall":69,"potential":69,"pace":70,"shooting":53,"passing":62,"defense":65,"physical":63},{"name":"Kevin Kelsy","position":"FWD","age":21,"overall":68,"potential":73,"pace":77,"shooting":67,"passing":48,"defense":27,"physical":67},{"name":"Finn Surman","position":"DEF","age":22,"overall":68,"potential":72,"pace":65,"shooting":33,"passing":49,"defense":66,"physical":78},{"name":"Juan David Mosquera","position":"DEF","age":22,"overall":67,"potential":71,"pace":79,"shooting":52,"passing":61,"defense":58,"physical":72},{"name":"Cristhian Paredes","position":"MID","age":29,"overall":67,"potential":67,"pace":66,"shooting":63,"passing":63,"defense":65,"physical":70},{"name":"Ariel Lassiter","position":"MID","age":32,"overall":66,"potential":66,"pace":81,"shooting":64,"passing":58,"defense":38,"physical":59},{"name":"Omir Fernandez","position":"MID","age":27,"overall":66,"potential":66,"pace":80,"shooting":53,"passing":58,"defense":44,"physical":56},{"name":"James Pantemis","position":"GK","age":28,"overall":65,"potential":65,"pace":66,"shooting":63,"passing":54,"defense":36,"physical":66},{"name":"Zac McGraw","position":"DEF","age":25,"overall":65,"potential":65,"pace":52,"shooting":41,"passing":53,"defense":64,"physical":75},{"name":"Dario Zuparic","position":"DEF","age":32,"overall":65,"potential":65,"pace":41,"shooting":22,"passing":45,"defense":64,"physical":74},{"name":"Eric Miller","position":"DEF","age":31,"overall":64,"potential":64,"pace":66,"shooting":37,"passing":52,"defense":61,"physical":71},{"name":"Trey Muse","position":"GK","age":28,"overall":54,"potential":54,"pace":56,"shooting":55,"passing":53,"defense":42,"physical":56},{"name":"Ian Smith","position":"DEF","age":23,"overall":54,"potential":58,"pace":56,"shooting":37,"passing":44,"defense":55,"physical":57}]},"real_salt_lake":{"name":"Real Salt Lake","players":[{"name":"Morgan Guilavogui","position":"FWD","age":24,"overall":73,"potential":73,"pace":74,"shooting":71,"passing":68,"defense":39,"physical":72},{"name":"Victor Olatunji","position":"FWD","age":22,"overall":73,"potential":77,"pace":77,"shooting":70,"passing":57,"defense":24,"physical":81},{"name":"Diego Luna","position":"MID","age":21,"overall":72,"potential":80,"pace":79,"shooting":64,"passing":66,"defense":42,"physical":71},{"name":"Stijn Spierings","position":"MID","age":28,"overall":71,"potential":71,"pace":48,"shooting":68,"passing":67,"defense":71,"physical":74},{"name":"Lukas Engel","position":"DEF","age":25,"overall":70,"potential":70,"pace":79,"shooting":58,"passing":64,"defense":64,"physical":69},{"name":"Pablo Ruiz","position":"MID","age":23,"overall":70,"potential":74,"pace":66,"shooting":61,"passing":68,"defense":66,"physical":65},{"name":"Emeka Eneli","position":"MID","age":21,"overall":70,"potential":75,"pace":70,"shooting":47,"passing":65,"defense":68,"physical":61},{"name":"Juan Arias","position":"DEF","age":26,"overall":70,"potential":70,"pace":63,"shooting":26,"passing":44,"defense":71,"physical":69},{"name":"Justen Glad","position":"DEF","age":29,"overall":69,"potential":69,"pace":67,"shooting":35,"passing":50,"defense":70,"physical":74},{"name":"Rafael","position":"GK","age":36,"overall":69,"potential":69,"pace":68,"shooting":64,"passing":56,"defense":43,"physical":69},{"name":"Dominik Marczuk","position":"MID","age":22,"overall":67,"potential":71,"pace":71,"shooting":62,"passing":63,"defense":55,"physical":60},{"name":"Javain Brown","position":"DEF","age":27,"overall":67,"potential":67,"pace":80,"shooting":42,"passing":55,"defense":67,"physical":73},{"name":"Tyler Wolff","position":"MID","age":22,"overall":67,"potential":71,"pace":73,"shooting":55,"passing":65,"defense":44,"physical":58},{"name":"Alexandros Katranis","position":"DEF","age":27,"overall":66,"potential":66,"pace":72,"shooting":49,"passing":60,"defense":62,"physical":66},{"name":"Zac MacMath","position":"GK","age":32,"overall":65,"potential":65,"pace":63,"shooting":63,"passing":64,"defense":37,"physical":65},{"name":"Noel Caliskan","position":"MID","age":23,"overall":64,"potential":68,"pace":66,"shooting":52,"passing":61,"defense":60,"physical":63},{"name":"Sam Junqua","position":"DEF","age":28,"overall":63,"potential":63,"pace":57,"shooting":40,"passing":51,"defense":64,"physical":68},{"name":"Zach Booth","position":"MID","age":20,"overall":63,"potential":70,"pace":73,"shooting":56,"passing":58,"defense":51,"physical":62},{"name":"Philip Quinton","position":"DEF","age":21,"overall":63,"potential":68,"pace":51,"shooting":24,"passing":38,"defense":63,"physical":76},{"name":"Zavier Gozo","position":"FWD","age":19,"overall":63,"potential":74,"pace":88,"shooting":59,"passing":51,"defense":35,"physical":58},{"name":"Kobi Henry","position":"DEF","age":22,"overall":59,"potential":65,"pace":60,"shooting":34,"passing":46,"defense":60,"physical":62},{"name":"Ariath Piol","position":"FWD","age":24,"overall":59,"potential":62,"pace":79,"shooting":56,"passing":44,"defense":30,"physical":65},{"name":"Mason Stajduhar","position":"GK","age":29,"overall":58,"potential":58,"pace":59,"shooting":56,"passing":58,"defense":33,"physical":57},{"name":"Matthew Bell","position":"FWD","age":27,"overall":51,"potential":51,"pace":53,"shooting":52,"passing":36,"defense":17,"physical":52}]},"san_diego_fc":{"name":"San Diego FC","players":[{"name":"Anders Dreyer","position":"MID","age":30,"overall":78,"potential":78,"pace":78,"shooting":80,"passing":76,"defense":41,"physical":65},{"name":"Hirving Lozano","position":"FWD","age":30,"overall":77,"potential":77,"pace":83,"shooting":75,"passing":71,"defense":41,"physical":58},{"name":"Marcus Ingvartsen","position":"FWD","age":30,"overall":74,"potential":74,"pace":62,"shooting":77,"passing":67,"defense":38,"physical":72},{"name":"Jeppe Tverskov","position":"MID","age":32,"overall":73,"potential":73,"pace":49,"shooting":52,"passing":65,"defense":71,"physical":78},{"name":"Lewis Morgan","position":"FWD","age":30,"overall":72,"potential":72,"pace":79,"shooting":74,"passing":70,"defense":55,"physical":65},{"name":"Amahl Pellegrino","position":"MID","age":36,"overall":71,"potential":71,"pace":82,"shooting":73,"passing":64,"defense":38,"physical":58},{"name":"Anibal Godoy","position":"MID","age":36,"overall":70,"potential":70,"pace":43,"shooting":56,"passing":65,"defense":64,"physical":75},{"name":"Tomas Angel","position":"FWD","age":24,"overall":68,"potential":71,"pace":81,"shooting":67,"passing":55,"defense":18,"physical":57},{"name":"Onni Valakari","position":"FWD","age":24,"overall":68,"potential":71,"pace":71,"shooting":64,"passing":65,"defense":56,"physical":71},{"name":"Andres Reyes","position":"DEF","age":28,"overall":67,"potential":67,"pace":71,"shooting":33,"passing":40,"defense":66,"physical":77},{"name":"Corey Baird","position":"FWD","age":31,"overall":66,"potential":66,"pace":77,"shooting":64,"passing":59,"defense":33,"physical":68},{"name":"Alex Mighten","position":"MID","age":24,"overall":66,"potential":70,"pace":78,"shooting":57,"passing":60,"defense":28,"physical":50},{"name":"Bryce Duke","position":"MID","age":25,"overall":65,"potential":67,"pace":58,"shooting":57,"passing":68,"defense":46,"physical":43},{"name":"Christopher McVey","position":"DEF","age":29,"overall":65,"potential":65,"pace":65,"shooting":33,"passing":58,"defense":62,"physical":79},{"name":"Emmanuel Boateng","position":"MID","age":32,"overall":63,"potential":63,"pace":80,"shooting":60,"passing":60,"defense":41,"physical":60},{"name":"Pablo Sisniega","position":"GK","age":29,"overall":63,"potential":63,"pace":63,"shooting":62,"passing":64,"defense":44,"physical":65},{"name":"Alejandro Alvarado","position":"MID","age":25,"overall":63,"potential":65,"pace":64,"shooting":51,"passing":66,"defense":44,"physical":46},{"name":"CJ dos Santos","position":"GK","age":25,"overall":63,"potential":65,"pace":62,"shooting":64,"passing":62,"defense":27,"physical":63},{"name":"Luca Bombino","position":"DEF","age":23,"overall":63,"potential":68,"pace":66,"shooting":42,"passing":56,"defense":60,"physical":58},{"name":"Willy Kumado","position":"DEF","age":23,"overall":62,"potential":67,"pace":82,"shooting":41,"passing":54,"defense":54,"physical":56},{"name":"Aiden Harangi","position":"DEF","age":22,"overall":62,"potential":67,"pace":71,"shooting":33,"passing":53,"defense":58,"physical":60},{"name":"Duran Ferree","position":"GK","age":21,"overall":60,"potential":66,"pace":60,"shooting":59,"passing":58,"defense":22,"physical":58},{"name":"Oscar Anthony Verhoeven","position":"DEF","age":22,"overall":60,"potential":65,"pace":68,"shooting":32,"passing":46,"defense":57,"physical":55},{"name":"Ian Pilcher","position":"DEF","age":21,"overall":55,"potential":62,"pace":55,"shooting":27,"passing":47,"defense":57,"physical":59},{"name":"David Vazquez","position":"MID","age":23,"overall":53,"potential":58,"pace":67,"shooting":53,"passing":43,"defense":22,"physical":39},{"name":"Anisse Saidi","position":"FWD","age":18,"overall":48,"potential":65,"pace":53,"shooting":52,"passing":34,"defense":19,"physical":41}]},"san_jose_earthquakes":{"name":"San Jose Earthquakes","players":[{"name":"Cristian Arango","position":"FWD","age":33,"overall":78,"potential":78,"pace":71,"shooting":78,"passing":70,"defense":36,"physical":71},{"name":"Timo Werner","position":"FWD","age":30,"overall":76,"potential":76,"pace":91,"shooting":73,"passing":68,"defense":35,"physical":66},{"name":"Josef Martinez","position":"FWD","age":33,"overall":73,"potential":73,"pace":78,"shooting":74,"passing":60,"defense":23,"physical":64},{"name":"Daniel","position":"GK","age":30,"overall":72,"potential":72,"pace":71,"shooting":71,"passing":70,"defense":23,"physical":74},{"name":"DeJuan Jones","position":"DEF","age":28,"overall":71,"potential":71,"pace":82,"shooting":57,"passing":65,"defense":66,"physical":75},{"name":"Vitor Costa","position":"DEF","age":27,"overall":69,"potential":69,"pace":76,"shooting":54,"passing":60,"defense":62,"physical":72},{"name":"Bruno Wilson","position":"DEF","age":29,"overall":69,"potential":69,"pace":50,"shooting":30,"passing":45,"defense":69,"physical":77},{"name":"Dave Romney","position":"DEF","age":31,"overall":68,"potential":68,"pace":50,"shooting":32,"passing":59,"defense":66,"physical":78},{"name":"Rodrigues","position":"DEF","age":25,"overall":68,"potential":70,"pace":67,"shooting":39,"passing":44,"defense":69,"physical":73},{"name":"Mark-Anthony Kaye","position":"MID","age":31,"overall":67,"potential":67,"pace":70,"shooting":53,"passing":61,"defense":66,"physical":72},{"name":"Nick Lima","position":"DEF","age":32,"overall":66,"potential":66,"pace":78,"shooting":58,"passing":60,"defense":61,"physical":72},{"name":"Ian Harkes","position":"MID","age":30,"overall":65,"potential":65,"pace":66,"shooting":57,"passing":63,"defense":60,"physical":71},{"name":"Benjamin Kikanovic","position":"MID","age":23,"overall":65,"potential":70,"pace":87,"shooting":58,"passing":51,"defense":56,"physical":63},{"name":"Niko Tsakiris","position":"MID","age":22,"overall":65,"potential":70,"pace":68,"shooting":46,"passing":62,"defense":61,"physical":57},{"name":"Preston Judd","position":"FWD","age":25,"overall":65,"potential":68,"pace":68,"shooting":66,"passing":41,"defense":20,"physical":70},{"name":"Beau Leroux","position":"MID","age":22,"overall":65,"potential":69,"pace":68,"shooting":61,"passing":60,"defense":59,"physical":61},{"name":"Noel Buck","position":"MID","age":21,"overall":64,"potential":71,"pace":68,"shooting":58,"passing":61,"defense":55,"physical":62},{"name":"Ousseni Bouda","position":"MID","age":27,"overall":64,"potential":64,"pace":76,"shooting":51,"passing":55,"defense":20,"physical":56},{"name":"Daniel Munie","position":"DEF","age":23,"overall":64,"potential":68,"pace":83,"shooting":25,"passing":47,"defense":67,"physical":65},{"name":"Earl Edwards Jr.","position":"GK","age":34,"overall":62,"potential":62,"pace":63,"shooting":62,"passing":63,"defense":42,"physical":63},{"name":"Jack Skahan","position":"MID","age":22,"overall":62,"potential":67,"pace":59,"shooting":47,"passing":60,"defense":48,"physical":61},{"name":"Jamar Ricketts","position":"MID","age":24,"overall":62,"potential":65,"pace":73,"shooting":47,"passing":58,"defense":57,"physical":58},{"name":"Max Floriani","position":"DEF","age":21,"overall":61,"potential":66,"pace":62,"shooting":34,"passing":51,"defense":62,"physical":64},{"name":"Reid Roberts","position":"DEF","age":21,"overall":60,"potential":65,"pace":61,"shooting":23,"passing":43,"defense":62,"physical":62},{"name":"Francesco Montali","position":"GK","age":20,"overall":55,"potential":62,"pace":58,"shooting":54,"passing":51,"defense":28,"physical":51}]},"sporting_kansas_city":{"name":"Sporting Kansas City","players":[{"name":"Dejan Joveljic","position":"FWD","age":26,"overall":75,"potential":75,"pace":76,"shooting":75,"passing":61,"defense":32,"physical":73},{"name":"Manu Garcia","position":"MID","age":27,"overall":74,"potential":74,"pace":77,"shooting":69,"passing":73,"defense":40,"physical":57},{"name":"Lasse Berg Johnsen","position":"MID","age":26,"overall":72,"potential":72,"pace":65,"shooting":66,"passing":70,"defense":69,"physical":82},{"name":"Tim Leibold","position":"DEF","age":32,"overall":70,"potential":70,"pace":74,"shooting":57,"passing":68,"defense":65,"physical":69},{"name":"Magomed-Shapi Suleymanov","position":"MID","age":22,"overall":69,"potential":74,"pace":74,"shooting":68,"passing":64,"defense":31,"physical":53},{"name":"Capita","position":"MID","age":25,"overall":69,"potential":71,"pace":90,"shooting":63,"passing":59,"defense":23,"physical":49},{"name":"Andrew Brody","position":"DEF","age":27,"overall":68,"potential":68,"pace":73,"shooting":40,"passing":57,"defense":63,"physical":70},{"name":"Jake Davis","position":"DEF","age":23,"overall":67,"potential":71,"pace":75,"shooting":50,"passing":55,"defense":65,"physical":59},{"name":"Memo Rodriguez","position":"MID","age":29,"overall":66,"potential":66,"pace":63,"shooting":63,"passing":66,"defense":58,"physical":57},{"name":"Logan Ndenbe","position":"DEF","age":25,"overall":66,"potential":68,"pace":79,"shooting":29,"passing":58,"defense":60,"physical":67},{"name":"John Pulskamp","position":"GK","age":26,"overall":64,"potential":64,"pace":67,"shooting":60,"passing":59,"defense":25,"physical":62},{"name":"Ethan Bartlow","position":"DEF","age":26,"overall":64,"potential":64,"pace":63,"shooting":22,"passing":37,"defense":64,"physical":72},{"name":"Stefan Cleveland","position":"GK","age":29,"overall":63,"potential":63,"pace":62,"shooting":63,"passing":62,"defense":55,"physical":63},{"name":"Khiry Shelton","position":"DEF","age":33,"overall":63,"potential":63,"pace":73,"shooting":58,"passing":58,"defense":59,"physical":78},{"name":"Zorhan Bassong","position":"DEF","age":22,"overall":63,"potential":68,"pace":74,"shooting":35,"passing":55,"defense":59,"physical":63},{"name":"Santiago Munoz","position":"FWD","age":24,"overall":63,"potential":66,"pace":71,"shooting":62,"passing":58,"defense":25,"physical":59},{"name":"Jacob Bartlett","position":"MID","age":21,"overall":62,"potential":67,"pace":66,"shooting":51,"passing":58,"defense":60,"physical":61},{"name":"Calvin Harris","position":"MID","age":24,"overall":62,"potential":65,"pace":82,"shooting":60,"passing":53,"defense":34,"physical":58},{"name":"Jansen Miller","position":"DEF","age":21,"overall":61,"potential":66,"pace":57,"shooting":31,"passing":45,"defense":61,"physical":65},{"name":"Alan Montes","position":"DEF","age":24,"overall":60,"potential":63,"pace":54,"shooting":33,"passing":48,"defense":60,"physical":65},{"name":"Jayden Reid","position":"DEF","age":21,"overall":60,"potential":65,"pace":85,"shooting":32,"passing":52,"defense":49,"physical":63},{"name":"Stephen Afrifa","position":"FWD","age":22,"overall":59,"potential":64,"pace":72,"shooting":60,"passing":46,"defense":18,"physical":51},{"name":"Wyatt Meyer","position":"DEF","age":21,"overall":59,"potential":64,"pace":61,"shooting":33,"passing":38,"defense":58,"physical":66},{"name":"Ian James","position":"DEF","age":18,"overall":56,"potential":68,"pace":52,"shooting":22,"passing":35,"defense":56,"physical":58},{"name":"Justin Reynolds","position":"DEF","age":19,"overall":54,"potential":63,"pace":58,"shooting":31,"passing":42,"defense":51,"physical":54},{"name":"Ryan Schewe","position":"GK","age":20,"overall":52,"potential":60,"pace":54,"shooting":50,"passing":57,"defense":26,"physical":48}]},"st_louis_city_sc":{"name":"St. Louis City SC","players":[{"name":"Roman Burki","position":"GK","age":34,"overall":76,"potential":76,"pace":77,"shooting":75,"passing":60,"defense":46,"physical":73},{"name":"Marcel Hartel","position":"MID","age":29,"overall":75,"potential":75,"pace":72,"shooting":71,"passing":73,"defense":43,"physical":61},{"name":"Eduard Lowen","position":"MID","age":28,"overall":74,"potential":74,"pace":66,"shooting":71,"passing":74,"defense":70,"physical":83},{"name":"Conrad Wallem","position":"MID","age":27,"overall":70,"potential":70,"pace":78,"shooting":61,"passing":67,"defense":54,"physical":68},{"name":"Timo Baumgartl","position":"DEF","age":29,"overall":69,"potential":69,"pace":56,"shooting":36,"passing":53,"defense":67,"physical":74},{"name":"Cedric Teuchert","position":"MID","age":27,"overall":68,"potential":68,"pace":70,"shooting":71,"passing":62,"defense":30,"physical":64},{"name":"Rasmus Alm","position":"MID","age":29,"overall":67,"potential":67,"pace":81,"shooting":61,"passing":62,"defense":38,"physical":60},{"name":"Sergio Cordova","position":"FWD","age":27,"overall":67,"potential":67,"pace":72,"shooting":67,"passing":52,"defense":24,"physical":68},{"name":"Kyle Hiebert","position":"DEF","age":24,"overall":67,"potential":70,"pace":68,"shooting":25,"passing":47,"defense":66,"physical":75},{"name":"Sang Bin Jeong","position":"FWD","age":24,"overall":67,"potential":71,"pace":87,"shooting":62,"passing":57,"defense":24,"physical":67},{"name":"Fallou Fall","position":"DEF","age":22,"overall":67,"potential":72,"pace":61,"shooting":32,"passing":51,"defense":66,"physical":69},{"name":"Daniel Edelman","position":"MID","age":25,"overall":67,"potential":69,"pace":70,"shooting":48,"passing":60,"defense":66,"physical":68},{"name":"Chris Durkin","position":"MID","age":24,"overall":66,"potential":69,"pace":56,"shooting":59,"passing":66,"defense":63,"physical":69},{"name":"Alfredo Morales","position":"MID","age":36,"overall":66,"potential":66,"pace":45,"shooting":59,"passing":65,"defense":62,"physical":75},{"name":"Dante Polvara","position":"MID","age":25,"overall":66,"potential":68,"pace":62,"shooting":57,"passing":62,"defense":64,"physical":74},{"name":"Jake Girdwood-Reich","position":"DEF","age":22,"overall":66,"potential":70,"pace":64,"shooting":41,"passing":53,"defense":65,"physical":75},{"name":"Celio Pompeu","position":"MID","age":23,"overall":65,"potential":69,"pace":75,"shooting":58,"passing":55,"defense":29,"physical":45},{"name":"Rafael Santos","position":"DEF","age":27,"overall":65,"potential":65,"pace":72,"shooting":45,"passing":55,"defense":61,"physical":63},{"name":"Tomas Ostrak","position":"MID","age":24,"overall":64,"potential":67,"pace":62,"shooting":56,"passing":63,"defense":54,"physical":62},{"name":"Akil Watts","position":"DEF","age":22,"overall":64,"potential":68,"pace":73,"shooting":49,"passing":55,"defense":61,"physical":70},{"name":"Joshua Yaro","position":"DEF","age":30,"overall":64,"potential":64,"pace":78,"shooting":26,"passing":46,"defense":65,"physical":67},{"name":"Lukas MacNaughton","position":"DEF","age":28,"overall":62,"potential":62,"pace":60,"shooting":33,"passing":40,"defense":62,"physical":69},{"name":"Ben Lundt","position":"GK","age":27,"overall":59,"potential":59,"pace":58,"shooting":57,"passing":57,"defense":45,"physical":61},{"name":"Tyson Pearce","position":"MID","age":18,"overall":53,"potential":66,"pace":66,"shooting":39,"passing":49,"defense":52,"physical":55}]},"toronto_fc":{"name":"Toronto FC","players":[{"name":"Djordje Mihailovic","position":"MID","age":27,"overall":75,"potential":75,"pace":71,"shooting":72,"passing":75,"defense":60,"physical":67},{"name":"Josh Sargent","position":"FWD","age":26,"overall":73,"potential":73,"pace":74,"shooting":74,"passing":62,"defense":48,"physical":81},{"name":"Richie Laryea","position":"DEF","age":31,"overall":73,"potential":73,"pace":90,"shooting":61,"passing":65,"defense":64,"physical":71},{"name":"Walker Zimmerman","position":"DEF","age":32,"overall":72,"potential":72,"pace":56,"shooting":50,"passing":54,"defense":70,"physical":82},{"name":"Jose Cifuentes","position":"MID","age":27,"overall":72,"potential":72,"pace":71,"shooting":61,"passing":68,"defense":70,"physical":78},{"name":"Daniel Salloi","position":"MID","age":30,"overall":71,"potential":71,"pace":75,"shooting":71,"passing":68,"defense":35,"physical":70},{"name":"Jonathan Osorio","position":"MID","age":33,"overall":71,"potential":71,"pace":50,"shooting":67,"passing":70,"defense":61,"physical":65},{"name":"Matheus Pereira","position":"DEF","age":25,"overall":69,"potential":69,"pace":77,"shooting":57,"passing":61,"defense":65,"physical":71},{"name":"Theo Corbeanu","position":"MID","age":23,"overall":68,"potential":73,"pace":77,"shooting":59,"passing":65,"defense":47,"physical":66},{"name":"Raheem Edwards","position":"MID","age":30,"overall":66,"potential":66,"pace":77,"shooting":52,"passing":61,"defense":60,"physical":70},{"name":"Luka Gavran","position":"GK","age":24,"overall":66,"potential":69,"pace":68,"shooting":66,"passing":66,"defense":28,"physical":65},{"name":"Alonso Coello","position":"MID","age":21,"overall":66,"potential":72,"pace":60,"shooting":38,"passing":63,"defense":60,"physical":65},{"name":"Derrick Etienne Jr.","position":"MID","age":29,"overall":65,"potential":65,"pace":81,"shooting":60,"passing":60,"defense":40,"physical":60},{"name":"William Yarbrough","position":"GK","age":37,"overall":63,"potential":63,"pace":63,"shooting":64,"passing":62,"defense":35,"physical":61},{"name":"Henry Wingo","position":"DEF","age":24,"overall":63,"potential":66,"pace":72,"shooting":46,"passing":58,"defense":62,"physical":68},{"name":"Kosi Thompson","position":"DEF","age":21,"overall":63,"potential":69,"pace":81,"shooting":50,"passing":54,"defense":57,"physical":64},{"name":"Nicksoen Gomis","position":"DEF","age":22,"overall":63,"potential":67,"pace":65,"shooting":28,"passing":43,"defense":63,"physical":68},{"name":"Zane Monlouis","position":"DEF","age":21,"overall":63,"potential":68,"pace":67,"shooting":31,"passing":43,"defense":64,"physical":69},{"name":"Kobe Franklin","position":"DEF","age":22,"overall":62,"potential":66,"pace":69,"shooting":33,"passing":54,"defense":60,"physical":49},{"name":"Deandre Kerr","position":"FWD","age":24,"overall":61,"potential":64,"pace":78,"shooting":59,"passing":52,"defense":47,"physical":71},{"name":"Jules-Anthony Vilsaint","position":"FWD","age":21,"overall":60,"potential":66,"pace":70,"shooting":62,"passing":43,"defense":26,"physical":58},{"name":"Lazar Stefanovic","position":"DEF","age":19,"overall":58,"potential":68,"pace":68,"shooting":23,"passing":35,"defense":60,"physical":57},{"name":"Markus Cimermancic","position":"MID","age":20,"overall":57,"potential":65,"pace":68,"shooting":52,"passing":56,"defense":46,"physical":58},{"name":"Nathaniel Edwards","position":"MID","age":20,"overall":54,"potential":62,"pace":77,"shooting":49,"passing":48,"defense":50,"physical":47},{"name":"Adisa De Rosario","position":"GK","age":19,"overall":52,"potential":61,"pace":52,"shooting":54,"passing":60,"defense":40,"physical":55}]},"vancouver_whitecaps_fc":{"name":"Vancouver Whitecaps FC","players":[{"name":"Thomas Muller","position":"MID","age":36,"overall":80,"potential":80,"pace":57,"shooting":79,"passing":82,"defense":55,"physical":65},{"name":"Ryan Gauld","position":"MID","age":30,"overall":77,"potential":77,"pace":81,"shooting":67,"passing":77,"defense":51,"physical":54},{"name":"Brian White","position":"FWD","age":29,"overall":75,"potential":75,"pace":77,"shooting":74,"passing":52,"defense":46,"physical":78},{"name":"Andres Cubas","position":"MID","age":29,"overall":74,"potential":74,"pace":69,"shooting":47,"passing":66,"defense":73,"physical":56},{"name":"Cheikh Sabaly","position":"FWD","age":25,"overall":72,"potential":75,"pace":86,"shooting":72,"passing":66,"defense":27,"physical":52},{"name":"Yohei Takaoka","position":"GK","age":30,"overall":71,"potential":71,"pace":70,"shooting":69,"passing":67,"defense":38,"physical":70},{"name":"Kenji Cabrera","position":"MID","age":24,"overall":71,"potential":74,"pace":69,"shooting":64,"passing":67,"defense":55,"physical":54},{"name":"Ranko Veselinovic","position":"DEF","age":26,"overall":70,"potential":70,"pace":65,"shooting":27,"passing":50,"defense":70,"physical":76},{"name":"Tristan Blackmon","position":"DEF","age":30,"overall":70,"potential":70,"pace":86,"shooting":43,"passing":58,"defense":68,"physical":79},{"name":"Mathias Laborda","position":"DEF","age":24,"overall":70,"potential":73,"pace":77,"shooting":47,"passing":57,"defense":69,"physical":73},{"name":"Emmanuel Sabbi","position":"FWD","age":27,"overall":70,"potential":70,"pace":90,"shooting":64,"passing":60,"defense":38,"physical":59},{"name":"Sebastian Berhalter","position":"MID","age":25,"overall":70,"potential":72,"pace":71,"shooting":62,"passing":71,"defense":65,"physical":71},{"name":"Sam Adekugbe","position":"DEF","age":28,"overall":68,"potential":68,"pace":83,"shooting":50,"passing":60,"defense":60,"physical":75},{"name":"Edier Ocampo","position":"DEF","age":22,"overall":68,"potential":72,"pace":84,"shooting":57,"passing":56,"defense":60,"physical":60},{"name":"Oliver Larraz","position":"MID","age":21,"overall":66,"potential":71,"pace":60,"shooting":43,"passing":56,"defense":65,"physical":62},{"name":"Jean-Claude Ngando","position":"MID","age":25,"overall":65,"potential":68,"pace":74,"shooting":52,"passing":64,"defense":57,"physical":63},{"name":"Aziel Jackson","position":"MID","age":23,"overall":64,"potential":68,"pace":79,"shooting":57,"passing":58,"defense":33,"physical":51},{"name":"Belal Halbouni","position":"DEF","age":22,"overall":64,"potential":68,"pace":59,"shooting":39,"passing":46,"defense":62,"physical":73},{"name":"Tate Johnson","position":"DEF","age":21,"overall":63,"potential":68,"pace":77,"shooting":40,"passing":52,"defense":57,"physical":64},{"name":"Ralph Priso","position":"MID","age":25,"overall":62,"potential":65,"pace":65,"shooting":41,"passing":54,"defense":60,"physical":65},{"name":"Adrian Zendejas","position":"GK","age":28,"overall":61,"potential":61,"pace":64,"shooting":60,"passing":59,"defense":37,"physical":60},{"name":"Jeevan Badwal","position":"MID","age":20,"overall":61,"potential":68,"pace":64,"shooting":49,"passing":59,"defense":49,"physical":54},{"name":"Giuseppe Bovalina","position":"DEF","age":21,"overall":60,"potential":65,"pace":71,"shooting":54,"passing":52,"defense":55,"physical":65},{"name":"Isaac Boehmer","position":"GK","age":22,"overall":59,"potential":63,"pace":60,"shooting":56,"passing":56,"defense":17,"physical":60},{"name":"Nelson Pierre","position":"FWD","age":21,"overall":54,"potential":60,"pace":72,"shooting":49,"passing":41,"defense":22,"physical":63}]}};

/* ============================================================
   FICTIONAL WORLD DATA
   ============================================================ */

const FICTIONAL_CLUB_NAMES = [
  "River Plate FC", "Steel City United", "Northbank Athletic", "Iron Bridge FC",
  "Coastal Rovers", "Highland Town", "Old Mill FC", "Sunset Harbor SC",
  "Redwood Rangers", "Granite Peak FC", "Harborlight United", "Millbrook Athletic",
  "Cinder City FC", "Wolfgate Rovers", "Emberfield United", "Stonecross FC",
  "Thistledown Athletic", "Ridgeline SC", "Brackenwood FC", "Copper Valley United",
  "Fairhaven Rovers", "Ashford Town", "Silverlake FC", "Duskbridge Athletic",
  "Meridian City SC", "Oakcrest United", "Palisade FC", "Ironmoor Rovers",
  "Brightwater Athletic", "Kingsford United", "Lowland Town FC", "Marrow Creek SC",
  "Nightingale Rovers", "Overlook Athletic", "Pinehollow FC", "Quarrystone United",
  "Rustlewood SC", "Slateford Rovers", "Thornbury Athletic", "Underhill FC",
  "Vesper Point United", "Westmark SC", "Yewgate Rovers", "Zenith City FC",
];

// Each pool pairs first/last names from the same background so names stay
// coherent (no "Aki Silva" mismatches) while the roster as a whole is
// genuinely international, the way a real lower-division squad would be.
const NATIONALITY_POOLS = [
  { // American / English-speaking
    first: ["James","Michael","David","Chris","Andrew","Tyler","Brandon","Jordan","Ryan","Kevin","Justin","Matthew","Joshua","Cole","Blake","Trevor","Austin","Derek","Sean","Marcus"],
    last: ["Johnson","Williams","Miller","Davis","Wilson","Anderson","Thomas","Moore","Martin","Harris","Clark","Lewis","Walker","Young","King","Baker","Foster","Reed","Cooper","Bennett"],
  },
  { // Spanish / Mexican / Latin American
    first: ["Carlos","Javier","Luis","Miguel","Diego","Alejandro","Fernando","Rodrigo","Emilio","Mateo","Sergio","Pablo","Andrés","Ricardo","Gustavo","Iván","Jesús","Raúl","Hugo","Adrián"],
    last: ["Hernández","García","Martínez","López","González","Rodríguez","Pérez","Sánchez","Ramírez","Torres","Flores","Rivera","Gómez","Díaz","Reyes","Morales","Vargas","Castillo","Ortiz","Medina"],
  },
  { // Brazilian / Portuguese
    first: ["João","Pedro","Lucas","Gabriel","Rafael","Bruno","Thiago","Felipe","Matheus","Gustavo","Vitor","Caio","Leonardo","Igor","Danilo","Renato","Douglas","Everton","Wesley","Anderson"],
    last: ["Silva","Santos","Oliveira","Souza","Pereira","Costa","Ferreira","Almeida","Carvalho","Rodrigues","Gomes","Martins","Araújo","Melo","Barbosa","Ribeiro","Nascimento","Cardoso","Teixeira","Correia"],
  },
  { // Francophone West African
    first: ["Kylian","Antoine","Paul","Ousmane","Moussa","Ibrahim","Adama","Yannick","Mamadou","Cheikh","Thierry","Didier","Patrice","Florent","Olivier","Souleymane","Aboubakar","Habib","Modibo","Boubacar"],
    last: ["Traoré","Diop","Koné","Diallo","Bamba","Fofana","Camara","N'Diaye","Kouassi","Touré","Keïta","Sangaré","Coulibaly","Sylla","Bakayoko","Diabaté","Konaté","Cissé","Doumbia","Sidibé"],
  },
  { // British Isles
    first: ["Harry","Jack","Oliver","George","Thomas","William","Charlie","Daniel","Alfie","Freddie","Callum","Connor","Aiden","Lewis","Joe","Finley","Reece","Declan","Rory","Owen"],
    last: ["Smith","Jones","Brown","Taylor","Evans","Wright","Robinson","Cook","White","Hughes","Edwards","Green","Hall","Wood","Baker","Shaw","Marshall","Fletcher","Kelly","Doyle"],
  },
  { // German / Dutch
    first: ["Lukas","Maximilian","Jonas","Niklas","Tobias","Felix","Sven","Jan","Daan","Bram","Ruben","Sem","Finn","Milan","Luuk","Timo","Niek","Stijn","Levi","Joris"],
    last: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Hoffmann","Koch","Bauer","Richter","Klein","Wolf","Krüger","de Vries","Bakker","Jansen","Visser","Smit"],
  },
  { // Italian
    first: ["Marco","Alessandro","Francesco","Matteo","Lorenzo","Andrea","Davide","Simone","Riccardo","Federico","Nicolò","Gabriele","Stefano","Luca","Giovanni","Emanuele","Fabio","Salvatore","Roberto","Antonio"],
    last: ["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo","Conti","De Luca","Mancini","Costa","Giordano","Rizzo","Lombardi","Moretti"],
  },
  { // Balkan / Eastern European
    first: ["Marko","Stefan","Nikola","Luka","Ivan","Petar","Filip","Aleksandar","Dušan","Vladimir","Bojan","Milan","Dario","Goran","Tomislav","Danijel","Ognjen","Vuk","Zoran","Slobodan"],
    last: ["Petrović","Jovanović","Nikolić","Ilić","Kovačević","Marković","Đorđević","Stojanović","Pavlović","Popović","Vasić","Radić","Simić","Todorović","Lukić","Stanković","Ristić","Savić","Micić","Blažević"],
  },
  { // West African English-speaking (Ghana/Nigeria)
    first: ["Kwame","Kofi","Emmanuel","Samuel","Daniel","Michael","Joseph","Isaac","Nana","Kwesi","Chidi","Chukwu","Chinedu","Obi","Ifeanyi","Godwin","Success","Victor","Emeka","Tunde"],
    last: ["Boateng","Mensah","Owusu","Asante","Appiah","Agyemang","Osei","Adjei","Okafor","Eze","Nwosu","Adeyemi","Okonkwo","Balogun","Chukwu","Afful","Yeboah","Amoako","Danso","Oduro"],
  },
  { // Scandinavian
    first: ["Erik","Lars","Anders","Magnus","Henrik","Emil","Oscar","Viktor","Gustav","Nils","Sander","Mats","Kristian","Jonas","Sindre","Aksel","Fredrik","Elias","Theo","Vidar"],
    last: ["Andersen","Hansen","Johansen","Nilsen","Olsen","Larsen","Pedersen","Kristiansen","Jensen","Karlsson","Berg","Haugen","Solberg","Dahl","Strand","Lindqvist","Holm","Sæther","Moen","Berge"],
  },
  { // Japanese / Korean
    first: ["Yuto","Kaito","Sota","Ren","Haruto","Riku","Sho","Minjun","Jihoon","Seojun","Daiki","Hayato","Yuki","Taiga","Kenshin","Junho","Doyoon","Siwoo","Hyunwoo","Taeyang"],
    last: ["Tanaka","Suzuki","Sato","Watanabe","Kim","Park","Lee","Choi","Yamamoto","Nakamura","Kobayashi","Itō","Yoshida","Yamada","Jung","Kang","Han","Yoon","Shimizu","Saito"],
  },
];

function randomName(usedNames) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const pool = choice(NATIONALITY_POOLS);
    const name = `${choice(pool.first)} ${choice(pool.last)}`;
    if (!usedNames || !usedNames.has(name)) {
      if (usedNames) usedNames.add(name);
      return name;
    }
  }
  // pool exhausted (extremely unlikely) — fall back to a disambiguated name
  const pool = choice(NATIONALITY_POOLS);
  const name = `${choice(pool.first)} ${choice(pool.last)} ${randInt(2, 99)}`;
  if (usedNames) usedNames.add(name);
  return name;
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function uid() { return Math.random().toString(36).slice(2, 10); }

// Growth room shrinks with age and is capped out by 29 — a 29+ player's
// potential is just their current overall, they are who they are. Young
// players carry a real gap. A rare dice roll (breakout / late bloomer) can
// push someone past what their age curve would normally allow.
function computePotential(age, overall) {
  let gap;
  if (age <= 20) gap = randInt(10, 22);
  else if (age <= 23) gap = randInt(6, 14);
  else if (age <= 26) {
    gap = randInt(2, 8);
    if (Math.random() < 0.12) gap += randInt(6, 12); // hidden-gem: still has real upside
  } else if (age <= 29) {
    gap = randInt(0, 4);
    if (Math.random() < 0.08) gap += randInt(5, 10); // rarer hidden gem this late
  } else {
    gap = 0; // 30+ — what you see is what you get, no more real ceiling left
  }
  let potential = Math.min(99, overall + gap);
  // breakout dice roll only makes sense for players young enough to still develop
  if (age <= 21 && Math.random() < 0.04) {
    potential = Math.min(99, potential + randInt(10, 25));
  }
  return Math.max(potential, overall);
}

// Realistic age spread for generated squads/markets: a fat wonderkid/youth
// tail, a big prime-age bulge, and a real (if smaller) veteran tail — rather
// than a flat 18-33 distribution that starves the market of both ends.
function randomPlayerAge() {
  const r = Math.random();
  if (r < 0.22) return randInt(16, 20);
  if (r < 0.70) return randInt(21, 28);
  if (r < 0.92) return randInt(29, 33);
  return randInt(34, 38);
}

// Retirement odds climb steeply from 34, essentially forced by 41 — most
// players never see 38, a handful grind on to 40.
function retirementChance(age) {
  if (age < 34) return 0;
  const table = { 34: 0.05, 35: 0.10, 36: 0.18, 37: 0.30, 38: 0.45, 39: 0.65, 40: 0.85 };
  return table[age] ?? 1.0;
}

// Called once per player at every season rollover: ages them a year and
// moves their overall toward (or past) their potential, then declines it
// once they're aging out. Sub-attributes drift loosely along with overall.
function growPlayer(p) {
  const age = p.age + 1;
  let delta;
  if (p.overall < p.potential) {
    if (age <= 21) delta = randInt(2, 5);
    else if (age <= 25) delta = randInt(1, 4);
    else if (age <= 29) delta = randInt(0, 2);
    else delta = randInt(-1, 1);
    delta = Math.min(delta, p.potential - p.overall);
  } else {
    if (age >= 33) delta = randInt(-4, -1);
    else if (age >= 30) delta = randInt(-2, 0);
    else delta = 0;
  }
  // rare late breakout: potential itself can still climb, but only for
  // players young enough that a real breakout is plausible
  let potential = p.potential;
  if (age <= 24 && Math.random() < 0.03) {
    potential = Math.min(99, potential + randInt(5, 15));
  }
  const overall = clamp(p.overall + delta, 30, 99);
  const attrDelta = Math.round(delta * 0.6);
  return {
    ...p,
    age,
    potential,
    overall,
    pace: clamp(p.pace + attrDelta + randInt(-2, 2), 15, 99),
    shooting: clamp(p.shooting + attrDelta + randInt(-2, 2), 15, 99),
    passing: clamp(p.passing + attrDelta + randInt(-2, 2), 15, 99),
    defense: clamp(p.defense + attrDelta + randInt(-2, 2), 15, 99),
    physical: clamp(p.physical + attrDelta + randInt(-2, 2), 15, 99),
  };
}

function makePlayer(position, overall, usedNames) {
  const rating = clamp(overall, 35, 95);
  const age = randomPlayerAge();
  return {
    id: uid(),
    name: randomName(usedNames),
    position,
    age,
    potential: computePotential(age, rating),
    overall: rating,
    pace: clamp(rating + randInt(-5, 5), 20, 99),
    shooting: clamp(rating + randInt(-5, 5), 20, 99),
    passing: clamp(rating + randInt(-5, 5), 20, 99),
    defense: clamp(rating + randInt(-5, 5), 20, 99),
    physical: clamp(rating + randInt(-5, 5), 20, 99),
    leadership: clamp(randInt(15, 55) + Math.round((age - 18) * 2.2), 15, 99),
    fitness: 100,
    morale: 70,
    injuredUntilMatchday: null,
    suspendedUntilMatchday: null,
    lastYellowMatchday: null,
    caps: 0,
    lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 5),
    wage: Math.round(rating * 50),
    transferListed: false,
    askingPrice: null,
  };
}

function generateFictionalSquad(baseRating, spread = 8, usedNames) {
  const layout = [
    "GK","GK","DEF","DEF","DEF","DEF","DEF","MID","MID","MID","MID","MID","FWD","FWD","FWD",
  ];
  return layout.map((pos) => makePlayer(pos, baseRating + randInt(-spread, spread), usedNames));
}

function realPlayerToRuntime(p) {
  return {
    id: uid(),
    name: p.name,
    position: p.position,
    age: p.age,
    potential: computePotential(p.age, p.overall),
    overall: p.overall,
    pace: p.pace,
    shooting: p.shooting,
    passing: p.passing,
    defense: p.defense,
    physical: p.physical,
    leadership: clamp(randInt(15, 55) + Math.round((p.age - 18) * 2.2), 15, 99),
    fitness: 100,
    morale: 70,
    injuredUntilMatchday: null,
    suspendedUntilMatchday: null,
    lastYellowMatchday: null,
    caps: 0,
    lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 5),
    wage: Math.round(p.overall * 50),
    transferListed: false,
    askingPrice: null,
  };
}

function defaultCaptain(squad) {
  if (!squad.length) return null;
  return [...squad].sort((a, b) => b.leadership - a.leadership)[0].id;
}

function makeClub({ name, squad, isReal, budget, academyEligible }) {
  return {
    id: uid(),
    name,
    isReal: !!isReal,
    squad,
    captainId: defaultCaptain(squad),
    tactics: { formation: "4-4-2", style: "balanced", press: "medium", lineupMode: "best" },
    budget: budget ?? randInt(3_000_000, 8_000_000),
    reputation: 50,
    academyEligible: !!academyEligible,
    academyStars: 0,
    academyInvested: 0,
    youthPlayers: [],
    tryoutCandidates: [],
  };
}

/* ============================================================
   WORLD BUILD — 3-tier pyramid
   ============================================================ */

const TIER_META = [
  { id: 0, name: "MLS", short: "MLS", color: "#C9A24B", baseRating: 68 },
  { id: 1, name: "USL Championship", short: "USLC", color: "#9BA8B0", baseRating: 58 },
  { id: 2, name: "USL League One", short: "USL1", color: "#B0703F", baseRating: 48 },
  { id: 3, name: "USL League Two", short: "USL2", color: "#6B7B70", baseRating: 40 },
];

// USL Championship — the actual second tier of American soccer, 25 clubs
// as of the 2026 season. Club identities are real; since fcratings/EA don't
// rate USL players the way they do MLS, individual rosters here are
// generated (same engine as the lower tiers) rather than scraped real players.
const USL_CHAMPIONSHIP_TEAMS = [
  "Birmingham Legion FC", "Brooklyn FC", "Charleston Battery", "Detroit City FC",
  "Hartford Athletic", "Indy Eleven", "Loudoun United FC", "Louisville City FC",
  "Miami FC", "Pittsburgh Riverhounds SC", "Rhode Island FC", "Sporting Club Jacksonville",
  "Tampa Bay Rowdies", "Colorado Springs Switchbacks FC", "El Paso Locomotive FC",
  "Las Vegas Lights FC", "Lexington SC", "Monterey Bay FC", "New Mexico United",
  "Oakland Roots SC", "Orange County SC", "Phoenix Rising FC", "Sacramento Republic FC",
  "San Antonio FC", "FC Tulsa",
];

// USL League One — the real third tier, 17 clubs as of the 2026 season.
const USL_LEAGUE_ONE_TEAMS = [
  "Athletic Club Boise", "AV Alta FC", "Charlotte Independence", "Chattanooga Red Wolves SC",
  "Corpus Christi FC", "Fort Wayne FC", "Forward Madison FC", "Greenville Triumph SC",
  "FC Naples", "New York Cosmos", "One Knoxville SC", "Portland Hearts of Pine",
  "Richmond Kickers", "Sarasota Paradise", "Spokane Velocity FC", "Union Omaha",
  "Westchester SC",
];

// USL League Two — real fourth tier, semi-pro/pre-professional. The actual
// league has 158 clubs across 20 regional divisions, far too many to model
// individually, so this is a representative sample of 20 real, currently
// active clubs rather than the full membership.
const USL_LEAGUE_TWO_TEAMS = [
  "Flint City Bucks", "Vermont Green FC", "Ballard FC", "Reading United AC",
  "Lionsbridge FC", "West Virginia United", "San Francisco City FC", "Minneapolis City SC",
  "Des Moines Menace", "Western Mass Pioneers", "Northern Virginia FC", "Asheville City SC",
  "Ventura County Fusion", "Ocean City Nor'easters FC", "Lehigh Valley United", "Steel City FC",
  "Colorado Storm", "Fort Lauderdale United", "Laredo Heat SC", "Hickory FC",
];

/* ============================================================
   ACADEMIES — MLS & USL Championship clubs only, sticky once started
   ============================================================ */

const ACADEMY_STAR_THRESHOLDS = [0, 750_000, 2_000_000, 4_000_000, 7_000_000, 11_000_000];
const ACADEMY_START_COST = ACADEMY_STAR_THRESHOLDS[1];
const ACADEMY_INVEST_INCREMENT = 1_500_000;
const ACADEMY_PROMOTE_MIN_AGE = 16;

function academyStarsForInvestment(invested) {
  let stars = 0;
  for (let i = 1; i < ACADEMY_STAR_THRESHOLDS.length; i++) {
    if (invested >= ACADEMY_STAR_THRESHOLDS[i]) stars = i;
  }
  return stars;
}

function academySigningCost(academyStars) {
  return 50_000 + academyStars * 20_000;
}

// Academy prospects start at 12 — low current ability, but potential scales
// with academy quality (a better academy finds and nurtures better talent).
function generateAcademyProspect(academyStars) {
  const position = choice(["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD"]);
  const age = 12;
  const potential = clamp(randInt(50, 65) + academyStars * 5 + randInt(-5, 5), 40, 95);
  const overall = clamp(20 + academyStars * 2 + randInt(-3, 3), 15, 40);
  return {
    id: uid(), name: randomName(), position, age, potential, overall,
    pace: clamp(overall + randInt(-5, 5), 10, 60),
    shooting: clamp(overall + randInt(-5, 5), 10, 60),
    passing: clamp(overall + randInt(-5, 5), 10, 60),
    defense: clamp(overall + randInt(-5, 5), 10, 60),
    physical: clamp(overall + randInt(-5, 5), 10, 60),
    leadership: clamp(randInt(10, 30), 10, 50),
    isYouth: true,
  };
}

// Academy quality decides development speed — a 5-star academy grows a kid
// noticeably faster per year than a fresh 1-star setup.
function growYouthProspect(p, academyStars) {
  const age = p.age + 1;
  const growth = randInt(2, 4) + academyStars;
  const overall = clamp(Math.min(p.potential, p.overall + growth), 10, 99);
  const attrDelta = Math.round(growth * 0.6);
  return {
    ...p, age, overall,
    pace: clamp(p.pace + attrDelta + randInt(-2, 2), 10, 99),
    shooting: clamp(p.shooting + attrDelta + randInt(-2, 2), 10, 99),
    passing: clamp(p.passing + attrDelta + randInt(-2, 2), 10, 99),
    defense: clamp(p.defense + attrDelta + randInt(-2, 2), 10, 99),
    physical: clamp(p.physical + attrDelta + randInt(-2, 2), 10, 99),
  };
}

function promoteYouthToFirstTeam(p) {
  return {
    ...p, isYouth: false, fitness: 100, morale: 70,
    injuredUntilMatchday: null, suspendedUntilMatchday: null, lastYellowMatchday: null,
    caps: 0, lastPlayedMatchday: null, contractYearsLeft: 3,
    wage: Math.round(p.overall * 30), transferListed: false, askingPrice: null,
  };
}

function youthSaleValue(p) {
  return Math.max(20_000, Math.round((Math.pow(p.potential, 2.4) * 5) / 100) * 100);
}

/* ============================================================
   OPEN TRYOUTS — USL League One & Two only (no academies there)
   ============================================================ */

function tryoutCost(tierId) {
  return tierId === 2 ? 80_000 : 40_000;
}

function generateTryoutCandidates(tierId) {
  const baseRating = TIER_META[tierId].baseRating;
  const count = randInt(4, 5);
  const candidates = [];
  for (let i = 0; i < count; i++) {
    let rating = baseRating + randInt(-14, 4);
    if (Math.random() < 0.07) {
      // rare gem — good enough to play a tier above this one
      rating = TIER_META[Math.max(0, tierId - 1)].baseRating + randInt(-5, 5);
    }
    candidates.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), rating));
  }
  return candidates;
}

function tryoutSigningCost(overall) {
  return Math.round(overall * 800);
}

/* ============================================================
   LEAGUE-WIDE DRAFT — MLS SuperDraft style
   ============================================================ */

// Round 1-3 -> MLS, rounds 4-5 -> USL Championship, round 6 -> USL League One.
// Order within each round is reverse of that tier's just-completed standings
// (worst finisher picks first), mirroring how real sports drafts work.
const DRAFT_PHASES = [
  { tierIdx: 0, rounds: 3 },
  { tierIdx: 1, rounds: 2 },
  { tierIdx: 2, rounds: 1 },
];

function generateDraftProspect(baseRating) {
  const position = choice(["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"]);
  const age = randInt(18, 22);
  const overall = clamp(baseRating + randInt(-8, 8), 35, 80);
  const potential = computePotential(age, overall);
  return {
    id: uid(), name: randomName(), position, age, potential, overall,
    pace: clamp(overall + randInt(-5, 5), 20, 99),
    shooting: clamp(overall + randInt(-5, 5), 20, 99),
    passing: clamp(overall + randInt(-5, 5), 20, 99),
    defense: clamp(overall + randInt(-5, 5), 20, 99),
    physical: clamp(overall + randInt(-5, 5), 20, 99),
    leadership: clamp(randInt(15, 55) + Math.round((age - 18) * 2.2), 15, 99),
    fitness: 100, morale: 70, injuredUntilMatchday: null, suspendedUntilMatchday: null,
    lastYellowMatchday: null, caps: 0, lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 4), wage: Math.round(overall * 40),
    transferListed: false, askingPrice: null,
  };
}

function draftProspectValue(p) {
  return Math.max(50_000, Math.round((Math.pow(p.potential, 2.3) * 6) / 1000) * 1000);
}

// Runs the whole draft against the tables computed for the season that just
// ended. Mutates newTiers directly for every AI pick; the user's own pick(s)
// come back separately so the UI can offer Keep/Sell before touching state.
function runDraft(tables, newTiers, userClubId) {
  const clubsByIdInNewTiers = {};
  newTiers.forEach((t) => t.clubs.forEach((c) => (clubsByIdInNewTiers[c.id] = c)));
  const userPicks = [];

  DRAFT_PHASES.forEach(({ tierIdx, rounds }) => {
    const order = [...tables[tierIdx]].reverse().map((r) => r.clubId); // worst finisher first
    const baseRating = TIER_META[tierIdx].baseRating + 6; // draft prospects skew a bit above replacement level
    for (let round = 0; round < rounds; round++) {
      order.forEach((clubId, posInRound) => {
        const roundQuality = baseRating - round * 3; // later rounds within a phase are slightly weaker
        const prospect = generateDraftProspect(roundQuality);
        if (clubId === userClubId) {
          userPicks.push({ prospect, tierIdx, round: round + 1 });
        } else {
          const club = clubsByIdInNewTiers[clubId];
          if (club) club.squad.push(prospect);
        }
      });
    }
  });

  return userPicks;
}


const PROMOTE_RELEGATE_COUNT = 3;
const TARGET_TIER_SIZE = 20;

function buildInitialWorld() {
  let nameIdx = 0;
  const nextFictionalName = () => FICTIONAL_CLUB_NAMES[nameIdx++ % FICTIONAL_CLUB_NAMES.length];
  const usedNames = new Set(); // shared across the whole world so no two players share a name

  // Tier 0: MLS — real rosters + fictional filler to reach TARGET_TIER_SIZE
  const realSlugs = Object.keys(MLS_ROSTERS);
  const mlsClubs = realSlugs.map((slug) => {
    const team = MLS_ROSTERS[slug];
    team.players.forEach((p) => usedNames.add(p.name));
    return makeClub({
      name: team.name,
      squad: team.players.map(realPlayerToRuntime),
      isReal: true,
      budget: randInt(8_000_000, 18_000_000),
      academyEligible: true,
    });
  });
  while (mlsClubs.length < TARGET_TIER_SIZE) {
    mlsClubs.push(
      makeClub({
        name: `${nextFictionalName()} (Expansion)`,
        squad: generateFictionalSquad(TIER_META[0].baseRating, 8, usedNames),
        isReal: false,
        budget: randInt(6_000_000, 12_000_000),
        academyEligible: true,
      })
    );
  }

  // Tier 1: USL Championship — real clubs, generated rosters
  const uslcClubs = USL_CHAMPIONSHIP_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[1].baseRating, 8, usedNames),
      isReal: false,
      budget: randInt(1_500_000, 4_000_000),
      academyEligible: true,
    })
  );

  // Tier 2: USL League One — real clubs, generated rosters (no academies —
  // these clubs run open tryouts instead)
  const usl1Clubs = USL_LEAGUE_ONE_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[2].baseRating, 8, usedNames),
      isReal: false,
      budget: randInt(600_000, 1_800_000),
    })
  );

  // Tier 3: USL League Two — real clubs (representative sample), generated rosters
  const usl2Clubs = USL_LEAGUE_TWO_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[3].baseRating, 8, usedNames),
      isReal: false,
      budget: randInt(150_000, 500_000),
    })
  );

  return [
    { id: 0, name: TIER_META[0].name, clubs: mlsClubs, fixtures: [] },
    { id: 1, name: TIER_META[1].name, clubs: uslcClubs, fixtures: [] },
    { id: 2, name: TIER_META[2].name, clubs: usl1Clubs, fixtures: [] },
    { id: 3, name: TIER_META[3].name, clubs: usl2Clubs, fixtures: [] },
  ];
}

/* ============================================================
   FIXTURE GENERATION (circle method, single round-robin)
   ============================================================ */

function generateRoundRobin(clubIds) {
  const clubs = [...clubIds];
  if (clubs.length % 2 === 1) clubs.push("BYE");
  const n = clubs.length;
  const fixed = clubs[0];
  let rest = clubs.slice(1);
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const half = n / 2 - 1;
    const left = [fixed, ...rest.slice(0, half)];
    const right = [...rest.slice(half)].reverse();
    const pairs = left.map((h, i) => [h, right[i]]);
    rounds.push(pairs);
    rest = [rest[rest.length - 1], ...rest.slice(0, rest.length - 1)];
  }
  const fixtures = [];
  rounds.forEach((pairs, idx) => {
    const matchday = idx + 1;
    pairs.forEach(([home, away]) => {
      if (home === "BYE" || away === "BYE") return;
      fixtures.push({ id: uid(), matchday, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
    });
  });
  return fixtures;
}

/* ============================================================
   MATCH ENGINE — ported from match_engine.py, extended with formations,
   card accumulation/suspensions, and appearance tracking
   ============================================================ */

const BASE_GOAL_RATE = 1.35;
const HOME_ADVANTAGE = 1.12;
const YELLOW_CARD_BASE_RATE = 1.15;
const RED_CARD_CHANCE = 0.02;
const INJURY_BASE_RATE = 0.12;
const FITNESS_DRAIN_MIN = 12;
const FITNESS_DRAIN_MAX = 22;
const MORALE_DELTA = { win: 4, loss: -5, draw: 0 };

const FORMATION_SLOTS = {
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  "5-3-2": { GK: 1, DEF: 5, MID: 3, FWD: 2 },
  "4-2-3-1": { GK: 1, DEF: 4, MID: 5, FWD: 1 },
};

function samplePoisson(lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function effectiveRating(p) {
  const fitnessFactor = 0.7 + 0.3 * (p.fitness / 100);
  const moraleFactor = 0.85 + 0.15 * (p.morale / 100);
  return p.overall * fitnessFactor * moraleFactor;
}

function isAvailable(p, matchday) {
  const notInjured = p.injuredUntilMatchday == null || p.injuredUntilMatchday < matchday;
  const notSuspended = p.suspendedUntilMatchday == null || p.suspendedUntilMatchday < matchday;
  return notInjured && notSuspended;
}

function unavailableReason(p, matchday) {
  if (p.injuredUntilMatchday != null && p.injuredUntilMatchday >= matchday) return "injured";
  if (p.suspendedUntilMatchday != null && p.suspendedUntilMatchday >= matchday) return "suspended";
  return null;
}

// Best XI = pure rating. Youth = prioritizes youngest players (weaker on
// paper, but they get the caps/growth), tie-broken by rating. Auto = rating
// with a fitness nudge, so tired starters naturally rotate for fresher legs
// rather than always fielding the same XI regardless of fatigue.
function lineupScore(mode, p) {
  if (mode === "youth") return -p.age * 1000 + effectiveRating(p);
  if (mode === "auto") return effectiveRating(p) + p.fitness * 0.15;
  return effectiveRating(p);
}

// Formation-aware XI picker: fills each positional bucket according to the
// club's lineup mode, then backfills any shortfall with the best remaining
// available players so a thin squad still fields close to 11. This is also
// used by the Tactics tab to preview the projected lineup before playing it.
function startingXI(club, matchday) {
  const mode = club.tactics.lineupMode || "best";
  const available = club.squad.filter((p) => isAvailable(p, matchday));
  const slots = FORMATION_SLOTS[club.tactics.formation] || FORMATION_SLOTS["4-4-2"];
  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  available.forEach((p) => { (byPos[p.position] || byPos.MID).push(p); });
  Object.keys(byPos).forEach((pos) => byPos[pos].sort((a, b) => lineupScore(mode, b) - lineupScore(mode, a)));

  const chosen = [];
  const chosenIds = new Set();
  Object.entries(slots).forEach(([pos, count]) => {
    (byPos[pos] || []).slice(0, count).forEach((p) => { chosen.push(p); chosenIds.add(p.id); });
  });
  const totalSlots = Object.values(slots).reduce((a, b) => a + b, 0);
  if (chosen.length < totalSlots) {
    const remaining = available.filter((p) => !chosenIds.has(p.id)).sort((a, b) => lineupScore(mode, b) - lineupScore(mode, a));
    for (const p of remaining) {
      if (chosen.length >= totalSlots) break;
      chosen.push(p);
      chosenIds.add(p.id);
    }
  }
  return chosen;
}

// Club-level DEF/MID/ATT star ratings (out of 5), based on the average
// overall of the best players in each line — roughly how many would start.
function clubLineRatings(club) {
  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  club.squad.forEach((p) => { (byPos[p.position] || byPos.MID).push(p.overall); });
  const topAvg = (arr, n) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => b - a).slice(0, n);
    return sorted.reduce((s, v) => s + v, 0) / sorted.length;
  };
  const toStars = (avg) => clamp(Math.round(((avg - 45) / 10) * 2) / 2, 0.5, 5);
  return {
    def: toStars(topAvg(byPos.DEF, 4)),
    mid: toStars(topAvg(byPos.MID, 4)),
    att: toStars(topAvg(byPos.FWD, 3)),
  };
}

// Same star scale as clubLineRatings, but scoped to only the players
// actually in the current starting XI — distinct from the whole-squad
// overview, since a thin bench or an injury crunch should visibly show up
// here even if the squad overall still looks strong.
function xiLineRatings(xi) {
  const byPos = { DEF: [], MID: [], FWD: [] };
  xi.forEach((p) => { if (byPos[p.position]) byPos[p.position].push(p.overall); });
  const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
  const toStars = (a) => (a === 0 ? 0 : clamp(Math.round(((a - 45) / 10) * 2) / 2, 0.5, 5));
  return {
    def: toStars(avg(byPos.DEF)),
    mid: toStars(avg(byPos.MID)),
    att: toStars(avg(byPos.FWD)),
  };
}

function StarRow({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("★");
    else if (i === full && half) stars.push("⯨");
    else stars.push("☆");
  }
  return <span style={{ letterSpacing: 1 }}>{stars.join("")}</span>;
}

function captainChemistryFactor(club, xi) {
  if (!club.captainId) return 1.0;
  const captain = xi.find((p) => p.id === club.captainId);
  if (!captain) return 1.0; // captain injured/suspended/not selected — no bonus, no penalty
  return clamp(1 + (captain.leadership - 50) / 1000, 0.95, 1.05);
}

function squadStrength(club, matchday) {
  const xi = startingXI(club, matchday);
  if (xi.length === 0) return 0;
  const avg = xi.reduce((s, p) => s + effectiveRating(p), 0) / xi.length;
  return avg * captainChemistryFactor(club, xi);
}

const ATTACK_MOD = { defensive: 0.85, balanced: 1.0, attacking: 1.15 };
const DEFENSE_MOD = { defensive: 1.15, balanced: 1.0, attacking: 0.85 };
const PRESS_MOD = { low: 0.95, medium: 1.0, high: 1.08 };

function attackStrength(club, matchday) {
  return squadStrength(club, matchday) * ATTACK_MOD[club.tactics.style] * PRESS_MOD[club.tactics.press];
}
function defenseStrength(club, matchday) {
  return squadStrength(club, matchday) * DEFENSE_MOD[club.tactics.style];
}
function expectedGoals(attacker, defender, matchday, isHome) {
  const atk = attackStrength(attacker, matchday);
  const dfn = defenseStrength(defender, matchday);
  const ratio = atk / Math.max(dfn, 1.0);
  let rate = BASE_GOAL_RATE * Math.pow(ratio, 1.15);
  if (isHome) rate *= HOME_ADVANTAGE;
  return Math.max(0.1, rate);
}

const SCORER_WEIGHTS = { FWD: 50, MID: 30, DEF: 15, GK: 5 };
function weightedScorer(xi) {
  const pool = xi.map((p) => [p, SCORER_WEIGHTS[p.position] ?? 10]);
  const total = pool.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [p, w] of pool) {
    r -= w;
    if (r <= 0) return p;
  }
  return xi[0];
}

function applyFitnessAndMorale(xi, result) {
  const delta = MORALE_DELTA[result];
  xi.forEach((p) => {
    p.fitness = clamp(p.fitness - randInt(FITNESS_DRAIN_MIN, FITNESS_DRAIN_MAX), 0, 100);
    p.morale = clamp(p.morale + delta, 0, 100);
  });
}

function recordAppearances(xi, matchday) {
  xi.forEach((p) => {
    p.caps = (p.caps || 0) + 1;
    p.lastPlayedMatchday = matchday;
  });
}

// A player can only pick up one yellow per match — a second is a red and a
// sent-off. Picking up a yellow in two consecutive matches they played also
// triggers a 1-match suspension (mirrors real accumulation rules, simplified).
function applyCardsAndInjuries(xi, clubName, matchday, events) {
  const sentOff = new Set();
  const carded = new Set();
  const eligible = () => xi.filter((p) => !sentOff.has(p.id));

  const yellows = samplePoisson(YELLOW_CARD_BASE_RATE);
  for (let i = 0; i < yellows; i++) {
    const pool = eligible();
    if (!pool.length) break;
    const p = choice(pool);
    if (carded.has(p.id)) {
      // second bookable offense this match — automatic red, sent off
      sentOff.add(p.id);
      p.suspendedUntilMatchday = matchday + 1;
      p.lastYellowMatchday = null;
      events.push({ type: "red_card", club: clubName, player: p.name, reason: "second yellow" });
      continue;
    }
    carded.add(p.id);
    events.push({ type: "yellow_card", club: clubName, player: p.name });
    if (p.lastYellowMatchday === matchday - 1) {
      p.suspendedUntilMatchday = matchday + 1;
      p.lastYellowMatchday = null;
      events.push({ type: "suspension", club: clubName, player: p.name, reason: "booked in consecutive matches" });
    } else {
      p.lastYellowMatchday = matchday;
    }
  }

  if (Math.random() < RED_CARD_CHANCE) {
    const pool = eligible();
    if (pool.length) {
      const p = choice(pool);
      sentOff.add(p.id);
      p.suspendedUntilMatchday = matchday + 1;
      events.push({ type: "red_card", club: clubName, player: p.name });
    }
  }

  const injuries = samplePoisson(INJURY_BASE_RATE);
  for (let i = 0; i < injuries && xi.length; i++) {
    const p = choice(xi);
    const duration = choice([1, 1, 2, 2, 3, 5]);
    p.injuredUntilMatchday = matchday + duration;
    events.push({ type: "injury", club: clubName, player: p.name, outFor: duration });
  }
}

function simulateMatch(fixture, home, away, matchday) {
  const homeXI = startingXI(home, matchday);
  const awayXI = startingXI(away, matchday);
  recordAppearances(homeXI, matchday);
  recordAppearances(awayXI, matchday);

  const homeXg = expectedGoals(home, away, matchday, true);
  const awayXg = expectedGoals(away, home, matchday, false);
  const homeGoals = samplePoisson(homeXg);
  const awayGoals = samplePoisson(awayXg);

  const events = [];
  for (let i = 0; i < homeGoals; i++) {
    const scorer = homeXI.length ? weightedScorer(homeXI) : null;
    events.push({ type: "goal", club: home.name, player: scorer ? scorer.name : "Unknown", minute: randInt(1, 90) });
  }
  for (let i = 0; i < awayGoals; i++) {
    const scorer = awayXI.length ? weightedScorer(awayXI) : null;
    events.push({ type: "goal", club: away.name, player: scorer ? scorer.name : "Unknown", minute: randInt(1, 90) });
  }
  events.sort((a, b) => (a.type === "goal" ? a.minute : 999) - (b.type === "goal" ? b.minute : 999));

  applyCardsAndInjuries(homeXI, home.name, matchday, events);
  applyCardsAndInjuries(awayXI, away.name, matchday, events);

  let homeResult, awayResult;
  if (homeGoals > awayGoals) { homeResult = "win"; awayResult = "loss"; }
  else if (homeGoals < awayGoals) { homeResult = "loss"; awayResult = "win"; }
  else { homeResult = awayResult = "draw"; }

  applyFitnessAndMorale(homeXI, homeResult);
  applyFitnessAndMorale(awayXI, awayResult);

  fixture.homeScore = homeGoals;
  fixture.awayScore = awayGoals;
  fixture.played = true;
  fixture.homeResult = homeResult;
  fixture.awayResult = awayResult;

  return { homeClub: home.name, awayClub: away.name, homeScore: homeGoals, awayScore: awayGoals, events };
}

/* ============================================================
   TABLE / STANDINGS
   ============================================================ */

function computeTable(tier) {
  const stats = {};
  tier.clubs.forEach((c) => {
    stats[c.id] = { clubId: c.id, club: c.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] };
  });
  const chronological = [...tier.fixtures].filter((f) => f.played).sort((a, b) => a.matchday - b.matchday);
  chronological.forEach((fx) => {
    const h = stats[fx.homeClubId], a = stats[fx.awayClubId];
    if (!h || !a) return;
    h.played++; a.played++;
    h.gf += fx.homeScore; h.ga += fx.awayScore;
    a.gf += fx.awayScore; a.ga += fx.homeScore;
    if (fx.homeScore > fx.awayScore) { h.won++; h.points += 3; a.lost++; h.form.push("W"); a.form.push("L"); }
    else if (fx.homeScore < fx.awayScore) { a.won++; a.points += 3; h.lost++; h.form.push("L"); a.form.push("W"); }
    else { h.drawn++; a.drawn++; h.points++; a.points++; h.form.push("D"); a.form.push("D"); }
  });
  Object.values(stats).forEach((r) => { r.form = r.form.slice(-4); });
  return Object.values(stats).sort((r1, r2) => (r2.points - r1.points) || ((r2.gf - r2.ga) - (r1.gf - r1.ga)) || (r2.gf - r1.gf));
}

/* ============================================================
   SEASON ROLLOVER — promotion/relegation + contracts
   ============================================================ */

const PRIZE_SHARE = { first: 0.25, second: 0.15, third: 0.10, midBand: 0.30, restBand: 0.20 };
const PRIZE_DECAY = 0.93; // each tier's prize pool shrinks ~7% every season
const MIN_PRIZE_POOL = [1_200_000, 600_000, 250_000, 100_000]; // hard floor per tier, so decay never bottoms out

// Guaranteed yearly backing from ownership, paid to every club regardless of
// standing — separate from performance bonuses, and sized so a typical squad
// at that tier can actually afford to renew contracts even in a bad season.
const OWNERSHIP_DEPOSIT = [5_000_000, 2_000_000, 900_000, 350_000];

function distributePrizeMoney(table, poolAmount) {
  const n = table.length;
  const amounts = {};
  const midCount = Math.min(7, Math.max(0, n - 3));
  const restCount = Math.max(0, n - 3 - midCount);
  const midEach = midCount > 0 ? Math.round((poolAmount * PRIZE_SHARE.midBand) / midCount) : 0;
  const restEach = restCount > 0 ? Math.round((poolAmount * PRIZE_SHARE.restBand) / restCount) : 0;
  table.forEach((row, i) => {
    let amt;
    if (i === 0) amt = Math.round(poolAmount * PRIZE_SHARE.first);
    else if (i === 1) amt = Math.round(poolAmount * PRIZE_SHARE.second);
    else if (i === 2) amt = Math.round(poolAmount * PRIZE_SHARE.third);
    else if (i < 3 + midCount) amt = midEach;
    else amt = restEach;
    amounts[row.clubId] = amt;
  });
  return amounts;
}

// Decays each tier's pool, then floors it against the tier below — the
// lowest tier's pool is the floor for the tier above it, cascading upward,
// so promotion never leaves a club worse off than it would have been had it
// stayed down, even after years of decay.
function decayPrizePools(prizePools) {
  const decayed = prizePools.map((p, i) => Math.max(MIN_PRIZE_POOL[i], Math.round(p * PRIZE_DECAY)));
  for (let i = decayed.length - 2; i >= 0; i--) {
    decayed[i] = Math.max(decayed[i], decayed[i + 1]);
  }
  return decayed;
}

const MAX_SQUAD_SIZE = 32;

// Keeps a squad from growing forever — draft picks, academy promotions, and
// AI replacements are all pure additions with nothing forcing a release, so
// without this a club's roster (and the whole saved game state) grows every
// single season without bound. Releases the lowest-value players first
// (weighted toward keeping the young/high-potential ones).
function trimSquad(squad) {
  if (squad.length <= MAX_SQUAD_SIZE) return squad;
  const scored = squad.map((p) => ({ p, score: p.overall + p.potential * 0.2 - p.age * 0.3 }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_SQUAD_SIZE).map((s) => s.p);
}

function rolloverSeason(tiers, userClubId, prizePools) {
  const tables = tiers.map(computeTable);
  const newTierClubIds = tiers.map((t) => t.clubs.map((c) => c.id));
  const clubsById = {};
  tiers.forEach((t) => t.clubs.forEach((c) => (clubsById[c.id] = c)));

  const events = []; // {clubName, from, to, type: 'promoted'|'relegated'|'champion'}

  for (let i = 0; i < tiers.length; i++) {
    const champion = clubsById[tables[i][0].clubId];
    events.push({ clubId: champion.id, clubName: champion.name, tier: i, type: "champion" });
  }

  for (let i = 0; i < tiers.length - 1; i++) {
    const upperTable = tables[i];
    const lowerTable = tables[i + 1];
    const relegated = upperTable.slice(-PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);
    const promoted = lowerTable.slice(0, PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);

    newTierClubIds[i] = newTierClubIds[i].filter((id) => !relegated.includes(id)).concat(promoted);
    newTierClubIds[i + 1] = newTierClubIds[i + 1].filter((id) => !promoted.includes(id)).concat(relegated);

    relegated.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i, to: i + 1, type: "relegated" }));
    promoted.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i + 1, to: i, type: "promoted" }));
  }

  // Prize money: distributed by final standing, paid from a per-tier pool
  // that shrinks a little every season (floored so it never dries up and
  // never lets a higher tier pay less than the one below it).
  const prizeAmountsByTier = tables.map((table, i) => distributePrizeMoney(table, prizePools[i]));
  const newPrizePools = decayPrizePools(prizePools);
  let userPrize = 0;
  prizeAmountsByTier.forEach((amounts) => { if (amounts[userClubId] != null) userPrize = amounts[userClubId]; });

  // Contracts: age and grow/decline every player, decrement contracts, refresh
  // fitness/injuries/suspensions. Also checks retirement (34+, climbing odds,
  // forced by 41). AI clubs auto-replace expired/retired contracts to keep
  // the world populated. The user's own club does NOT get auto-replaced —
  // a contract that reaches 0, or a player who retires, leaves as-is and the
  // slot stays open, so renewing ahead of time is a real decision.
  let userRetirements = [];
  const newTiers = tiers.map((t, i) => {
    const clubs = newTierClubIds[i].map((id) => {
      const club = clubsById[id];
      const baseRating = TIER_META[i].baseRating;
      const isUser = id === userClubId;
      let squad = club.squad.map((p) => {
        const grown = growPlayer(p);
        return {
          ...grown,
          contractYearsLeft: grown.contractYearsLeft - 1,
          fitness: Math.min(100, grown.fitness + 40),
          morale: Math.round(grown.morale + (55 - grown.morale) * 0.4),
          injuredUntilMatchday: null,
          suspendedUntilMatchday: null,
          lastYellowMatchday: null,
        };
      });
      const retiring = squad.filter((p) => Math.random() < retirementChance(p.age));
      if (isUser && retiring.length) userRetirements = userRetirements.concat(retiring.map((p) => p.name));
      const retiredIds = new Set(retiring.map((p) => p.id));
      squad = squad.filter((p) => !retiredIds.has(p.id));
      if (isUser) {
        squad = squad.filter((p) => p.contractYearsLeft > 0);
      } else {
        // AI renews its good players instead of always churning them for a
        // random replacement — a club's best 1-2 players almost always get
        // renewed, mid-tier squad players usually do, fringe players are the
        // ones who actually turn over most seasons.
        const byRank = [...squad].sort((a, b) => b.overall - a.overall);
        const rankById = new Map(byRank.map((p, i) => [p.id, i]));
        squad = squad.map((p) => {
          if (p.contractYearsLeft > 0) return p;
          const rank = rankById.get(p.id);
          const renewChance = rank <= 1 ? 0.9 : rank <= 5 ? 0.7 : 0.4;
          if (Math.random() < renewChance) {
            return { ...p, contractYearsLeft: randInt(2, 4), wage: Math.round(p.wage * 1.05) };
          }
          return makePlayer(p.position, baseRating + randInt(-8, 8));
        });
        // top back up to a full squad if retirements left an AI club short
        while (squad.length < 15) {
          squad.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), baseRating + randInt(-8, 8)));
        }
      }
      const prize = prizeAmountsByTier[i][id] ?? 0;
      const youthPlayers = (club.youthPlayers || []).map((p) => growYouthProspect(p, club.academyStars || 0));
      return {
        ...club,
        squad,
        budget: club.budget + prize + OWNERSHIP_DEPOSIT[i],
        academyEligible: !!club.academyEligible || i <= 1,
        youthPlayers,
        tryoutCandidates: [], // last window's tryout candidates don't carry over — sign or lose them
      };
    });
    return { id: t.id, name: t.name, clubs, fixtures: generateRoundRobin(clubs.map((c) => c.id)) };
  });

  const windowResult = runTransferWindow(newTiers, userClubId);
  const userDraftPicks = runDraft(tables, newTiers, userClubId);

  // Draft additions are the one pure-growth step with no natural release —
  // cap every club (except the user's, whose picks aren't applied until
  // they choose Keep) so the world can't balloon season over season.
  newTiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id !== userClubId) c.squad = trimSquad(c.squad);
    });
  });

  return { newTiers, events, tables, windowResult, newPrizePools, userPrize, userRetirements, userDraftPicks };
}

/* ============================================================
   TRANSFER MARKET (windowed — mirrors real preseason/midseason windows)
   ============================================================ */

const MID_SEASON_WINDOW_MATCHDAY = 10; // window opens once matchday 9 is complete

function marketValue(p) {
  // exponential curve: a 60 OVR squad player runs ~$1M, an 80 OVR quality
  // starter ~$9M, a genuine 85+ OVR star well into eight figures
  const base = 500 * Math.pow(1.135, p.overall);
  let ageFactor = p.age <= 23 ? 1.5 : p.age <= 26 ? 1.2 : p.age <= 29 ? 1.0 : p.age <= 32 ? 0.55 : 0.25;
  // true megastars keep real commercial/marquee value even late in their
  // career — an aging legend doesn't collapse to bench-player money
  if (p.overall >= 85) ageFactor = Math.max(ageFactor, 0.6);
  const potFactor = 1 + (p.potential - p.overall) * 0.04;
  return Math.round((base * ageFactor * potFactor) / 1000) * 1000;
}

// Renewals aren't free or unlimited: a very unhappy player just says no, a
// merely unhappy one will only re-sign for a much bigger bonus, and it always
// comes out of the budget.
function renewalOutcome(p, budget) {
  if (p.morale < 20) {
    return { accepted: false, reason: "too unhappy to even discuss an extension right now" };
  }
  const baseCost = Math.round(marketValue(p) * 0.10);
  let moraleFactor;
  if (p.morale >= 70) moraleFactor = 1.0;
  else if (p.morale >= 50) moraleFactor = 1.3;
  else if (p.morale >= 30) moraleFactor = 1.8;
  else moraleFactor = 2.5;
  const cost = Math.round(baseCost * moraleFactor);
  if (budget < cost) {
    return { accepted: false, reason: "you can't afford the deal they're asking for", cost };
  }
  return { accepted: true, cost };
}

// A club's best couple of players are its "untouchables" — real clubs don't
// routinely shop their two best players, and a DP-tier star getting listed
// alongside squad filler at the same rate was the bug behind Inter Miami
// casually selling Messi for pocket change. Rank 1-2 essentially never list;
// rank 3 can, but rarely.
function listingChance(rankAmongSquad) {
  if (rankAmongSquad === 0 || rankAmongSquad === 1) return 0.01;
  if (rankAmongSquad === 2) return 0.04;
  return 0.18;
}

// Runs a batch of AI market activity: some non-user players go up for sale,
// and some of those get bought by other AI clubs — so by the time the user
// opens the Market tab there's actually something there, and the whole
// pyramid keeps trading in the background between windows.
function runTransferWindow(tiers, userClubId) {
  let listedCount = 0, transferCount = 0;
  tiers.forEach((t) => {
    t.clubs.forEach((club) => {
      if (club.id === userClubId) return;
      const byRank = [...club.squad].sort((a, b) => b.overall - a.overall);
      byRank.forEach((p, rank) => {
        if (!p.transferListed && Math.random() < listingChance(rank)) {
          p.transferListed = true;
          p.askingPrice = Math.round(marketValue(p) * (1 + Math.random() * 0.3));
          listedCount++;
        }
      });
    });
    t.clubs.forEach((seller) => {
      if (seller.id === userClubId) return;
      const listedNow = seller.squad.filter((p) => p.transferListed);
      listedNow.forEach((p) => {
        if (Math.random() >= 0.35) return;
        const buyers = t.clubs.filter((c) => c.id !== seller.id && c.id !== userClubId && c.budget >= p.askingPrice && c.squad.length < 26);
        if (!buyers.length) return;
        const buyer = choice(buyers);
        buyer.budget -= p.askingPrice;
        seller.budget += p.askingPrice;
        p.transferListed = false;
        p.askingPrice = null;
        seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
        buyer.squad.push(p);
        transferCount++;
      });
    });
  });
  return { listedCount, transferCount };
}

/* ============================================================ */
export { }; // marker (rest of file continues with React component)
/* ============================================================
   VISUAL TOKENS
   ============================================================ */

const PALETTE = {
  pitch: "#0F3D2E",
  pitchDark: "#0A2B20",
  parchment: "#F2EFE4",
  parchmentDim: "#E7E2D3",
  gold: "#C9A24B",
  silver: "#9BA8B0",
  bronze: "#B0703F",
  crimson: "#8C3A3A",
  ink: "#16232B",
  inkSoft: "#4A5A61",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');`;

const display = { fontFamily: "'Oswald', sans-serif", letterSpacing: "0.02em" };
const serif = { fontFamily: "'Source Serif 4', Georgia, serif" };
const mono = { fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace" };

function crestColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue}, 45%, 32%)`;
}
function initials(name) {
  const words = name.replace(/\(.*\)/, "").trim().split(/\s+/).filter((w) => !/^(FC|SC|United|Town|City)$/i.test(w));
  const letters = (words.length ? words : name.split(" ")).slice(0, 2).map((w) => w[0]).join("");
  return letters.toUpperCase().slice(0, 3);
}

function Crest({ name, size = 40 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: crestColor(name), color: PALETTE.parchment,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
        border: `2px solid ${PALETTE.parchmentDim}`, ...display,
      }}
    >
      {initials(name)}
    </div>
  );
}

function TierBadge({ tierId }) {
  const meta = TIER_META[tierId];
  return (
    <span
      style={{
        background: meta.color, color: PALETTE.ink, padding: "2px 10px",
        borderRadius: 4, fontSize: 12, fontWeight: 700, ...display,
      }}
    >
      {meta.short}
    </span>
  );
}

/* ============================================================
   CLUB SELECT SCREEN
   ============================================================ */

function formatMoney(amount) {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const rounded = Math.round(m * 10) / 10;
    const str = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
    return `$${str}M`;
  }
  return `$${Math.round(amount / 1000)}K`;
}

function ClubSelectScreen({ world, onPick, saveWasReset }) {
  const [openTier, setOpenTier] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ ...display, fontSize: 56, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 15, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Pick a club. Climb the pyramid. Become champions.
          </div>
        </div>

        {saveWasReset && (
          <div style={{ background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}55`, borderRadius: 8, padding: 14, marginBottom: 24, ...serif, fontSize: 13, color: PALETTE.parchment }}>
            The game's been updated since your last save, and your old save isn't compatible with this version — starting fresh. Sorry about that!
          </div>
        )}

        {TIER_META.map((meta) => {
          const tier = world[meta.id];
          const isOpen = openTier === meta.id;
          return (
            <div key={meta.id} style={{ marginBottom: 16, border: `1px solid ${meta.color}55`, borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenTier(isOpen ? -1 : meta.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", background: isOpen ? meta.color : `${meta.color}22`,
                  border: "none", cursor: "pointer", color: isOpen ? PALETTE.ink : PALETTE.parchment,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", flex: 1, minWidth: 0 }}>
                  <span style={{ ...display, fontSize: 22, fontWeight: 700, textAlign: "left" }}>{meta.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  <span style={{ fontSize: 12.5, ...mono, opacity: 0.85, whiteSpace: "nowrap" }}>
                    Funds: {formatMoney(OWNERSHIP_DEPOSIT[meta.id])}/season
                  </span>
                  <ChevronRight size={20} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                </div>
              </button>
              {isOpen && (
                <div style={{ background: PALETTE.pitch, padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
                  {tier.clubs.map((club) => {
                    const avgOvr = Math.round(club.squad.reduce((s, p) => s + p.overall, 0) / club.squad.length);
                    return (
                      <button
                        key={club.id}
                        onClick={() => onPick(meta.id, club.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                          background: PALETTE.parchment, border: "none", borderRadius: 8, cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <Crest name={club.name} size={34} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...display, fontWeight: 600, fontSize: 14, color: PALETTE.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {club.name}
                          </div>
                          <div style={{ fontSize: 12, color: PALETTE.inkSoft, ...mono }}>
                            {club.isReal ? "real roster" : "generated roster"} · OVR {avgOvr}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SEASON ROLLOVER CEREMONY
   ============================================================ */

function RolloverModal({ events, userClubId, seasonNumber, windowResult, userPrize, ownershipDeposit, userRetirements, onContinue }) {
  const champions = events.filter((e) => e.type === "champion");
  const moves = events.filter((e) => e.type !== "champion");
  const userMove = moves.find((e) => e.clubId === userClubId);
  const userChamp = champions.find((e) => e.clubId === userClubId);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onContinue}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 28 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 26, fontWeight: 700, color: PALETTE.ink, marginBottom: 4 }}>
          Season {seasonNumber} complete
        </div>
        <div style={{ ...serif, color: PALETTE.inkSoft, marginBottom: 20, fontSize: 14 }}>
          Here's how the pyramid shook out.
        </div>

        {userChamp && (
          <div style={{ background: PALETTE.gold, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={22} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              You won the {TIER_META[userChamp.tier].name} title!
            </div>
          </div>
        )}
        {userMove && (
          <div style={{
            background: userMove.type === "promoted" ? "#DCEEDD" : "#F4E0E0", borderRadius: 8, padding: 14, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {userMove.type === "promoted" ? <ArrowUpCircle size={22} color="#2E7D32" /> : <ArrowDownCircle size={22} color={PALETTE.crimson} />}
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userMove.type === "promoted"
                ? `Promoted to ${TIER_META[userMove.to].name}!`
                : `Relegated to ${TIER_META[userMove.to].name}.`}
            </div>
          </div>
        )}
        {!userMove && !userChamp && (
          <div style={{ ...serif, color: PALETTE.inkSoft, marginBottom: 16, fontSize: 14 }}>
            Your club stays put — no promotion or relegation this time.
          </div>
        )}

        {(userPrize > 0 || ownershipDeposit > 0) && (
          <div style={{ background: "#E8E2CE", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            💰 Ownership deposit: <strong>${ownershipDeposit.toLocaleString()}</strong>{userPrize > 0 && <> · League finish bonus: <strong>${userPrize.toLocaleString()}</strong></>} added to your budget.
          </div>
        )}

        {windowResult && (
          <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 16 }}>
            Preseason window: {windowResult.listedCount} players listed, {windowResult.transferCount} deals done across the pyramid. Check the Market tab.
          </div>
        )}

        {userRetirements && userRetirements.length > 0 && (
          <div style={{ background: "#EFE6D8", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 13, color: PALETTE.ink }}>
            🎽 Hanging up the boots: <strong>{userRetirements.join(", ")}</strong> retired this offseason.
          </div>
        )}

        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 20 }}>
          Champions
        </div>
        {champions.map((c) => (
          <div key={c.clubId} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: PALETTE.ink, marginBottom: 4, ...serif }}>
            <TierBadge tierId={c.tier} /> {c.clubName}
          </div>
        ))}

        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 16 }}>
          Movement
        </div>
        <div style={{ maxHeight: 160, overflowY: "auto" }}>
          {moves.map((m) => (
            <div key={m.clubId + m.type} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 3, ...serif }}>
              {m.type === "promoted" ? <TrendingUp size={14} color="#2E7D32" /> : <TrendingDown size={14} color={PALETTE.crimson} />}
              {m.clubName} {m.type === "promoted" ? `→ ${TIER_META[m.to].short}` : `→ ${TIER_META[m.to].short}`}
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          style={{ marginTop: 24, width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "12px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Continue to Season {seasonNumber + 1}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MATCHDAY RECAP PANEL
   ============================================================ */

function MatchdayRecap({ results, userClubName, onClose }) {
  if (!results) return null;
  const eventIcon = { goal: "⚽", yellow_card: "🟨", red_card: "🟥", injury: "🩹", suspension: "⛔" };
  const sortedMatches = [...results.matches].sort((a, b) => {
    const aUser = a.homeClub === userClubName || a.awayClub === userClubName;
    const bUser = b.homeClub === userClubName || b.awayClub === userClubName;
    return (bUser ? 1 : 0) - (aUser ? 1 : 0);
  });
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 480, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink }}>Matchday {results.matchday}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        {sortedMatches.map((m, i) => {
          const isUser = m.homeClub === userClubName || m.awayClub === userClubName;
          return (
            <div key={i} style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: isUser ? PALETTE.parchmentDim : "transparent", border: isUser ? `1px solid ${PALETTE.gold}` : "none" }}>
              <div style={{ ...display, fontWeight: 600, fontSize: 15, color: PALETTE.ink }}>
                {m.homeClub} <span style={{ ...mono }}>{m.homeScore} - {m.awayScore}</span> {m.awayClub}
              </div>
              {isUser && m.events.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: PALETTE.inkSoft, ...serif }}>
                  {m.events.map((e, j) => (
                    <div key={j}>
                      {eventIcon[e.type]} {e.player} ({e.club}){e.type === "goal" ? ` — ${e.minute}'` : ""}
                      {e.type === "injury" ? ` — out ${e.outFor} matchday(s)` : ""}
                      {e.type === "suspension" ? ` — suspended next match` : ""}
                      {e.type === "red_card" && e.reason === "second yellow" ? ` (2nd yellow)` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={onClose}
          style={{ marginTop: 8, width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD TABS
   ============================================================ */

function SquadTab({ club, matchday, onToggleList, onRenew, onSetCaptain }) {
  const [lineupOpen, setLineupOpen] = useState(false);
  const xi = startingXI(club, matchday);
  const xiIds = new Set(xi.map((p) => p.id));
  const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const xiSorted = [...xi].sort((a, b) => posOrder[a.position] - posOrder[b.position]);

  const sorted = [...club.squad].sort((a, b) => posOrder[a.position] - posOrder[b.position] || b.overall - a.overall);
  const captainOnPitch = xi.some((p) => p.id === club.captainId);
  const lineRatings = clubLineRatings(club);

  return (
    <div>
      <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
        {[["DEF", lineRatings.def], ["MID", lineRatings.mid], ["ATT", lineRatings.att]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase" }}>{label}</span>
            <span style={{ color: PALETTE.gold, fontSize: 16 }}><StarRow value={val} /></span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: PALETTE.inkSoft, ...serif, alignSelf: "center" }}>
          (whole squad — see Tactics tab for your current XI's rating)
        </span>
      </div>

      <div style={{ marginBottom: 16, border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8 }}>
        <button
          onClick={() => setLineupOpen((v) => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
          }}
        >
          <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>
            Current lineup — {club.tactics.formation} {captainOnPitch ? "· captain on the pitch" : ""}
          </span>
          <ChevronRight size={16} style={{ color: PALETTE.inkSoft, transform: lineupOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {lineupOpen && (
          <div style={{ padding: "0 14px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {xiSorted.map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6,
                background: PALETTE.parchmentDim, fontSize: 12.5, ...serif,
              }}>
                <span style={{ ...mono, color: PALETTE.inkSoft, fontSize: 11 }}>{p.position}</span>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                {p.id === club.captainId && <span title="Captain" style={{ color: PALETTE.gold }}>©</span>}
                <span style={{ ...mono, color: PALETTE.inkSoft }}>{p.overall}</span>
              </div>
            ))}
            {xi.length < 11 && (
              <div style={{ fontSize: 12, color: PALETTE.crimson, ...serif, padding: "6px 4px" }}>
                Only {xi.length} available — injuries/suspensions are thinning the squad.
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...serif }}>
          <thead>
            <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
              {["", "Pos", "Name", "Age", "OVR", "POT", "LDR", "Caps", "Since played", "Fitness", "Contract", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "6px 8px", ...display, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const injured = p.injuredUntilMatchday != null && p.injuredUntilMatchday >= matchday;
              const suspended = !injured && p.suspendedUntilMatchday != null && p.suspendedUntilMatchday >= matchday;
              const sinceLastPlayed = p.lastPlayedMatchday == null ? "—" : matchday - p.lastPlayedMatchday;
              const expiring = p.contractYearsLeft <= 1;
              const isCaptain = p.id === club.captainId;
              return (
                <tr key={p.id} style={{ borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                  <td style={{ padding: "6px 4px" }}>{xiIds.has(p.id) ? <span style={{ color: PALETTE.gold, fontWeight: 700 }}>●</span> : ""}</td>
                  <td style={{ padding: "6px 8px", ...mono, fontSize: 12 }}>{p.position}</td>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{p.name}{isCaptain && <span title="Captain" style={{ color: PALETTE.gold, marginLeft: 4 }}>©</span>}</td>
                  <td style={{ padding: "6px 8px", ...mono }}>{p.age}</td>
                  <td style={{ padding: "6px 8px", ...mono, fontWeight: 700 }}>{p.overall}</td>
                  <td style={{ padding: "6px 8px", ...mono, color: PALETTE.inkSoft }}>{p.potential}</td>
                  <td style={{ padding: "6px 8px", ...mono, color: PALETTE.inkSoft }}>{p.leadership ?? "—"}</td>
                  <td style={{ padding: "6px 8px", ...mono }}>{p.caps || 0}</td>
                  <td style={{ padding: "6px 8px", ...mono }}>{sinceLastPlayed}</td>
                  <td style={{ padding: "6px 8px", ...mono }}>{p.fitness}</td>
                  <td style={{ padding: "6px 8px", ...mono, color: expiring ? PALETTE.crimson : PALETTE.ink }}>{p.contractYearsLeft}y</td>
                  <td style={{ padding: "6px 8px" }}>
                    {injured ? <span style={{ color: PALETTE.crimson }}>injured</span>
                      : suspended ? <span style={{ color: PALETTE.crimson }}>suspended</span>
                      : p.transferListed ? <span style={{ color: PALETTE.gold }}>listed ${p.askingPrice?.toLocaleString()}</span> : ""}
                  </td>
                  <td style={{ padding: "6px 8px", display: "flex", gap: 6 }}>
                    <button
                      onClick={() => onToggleList(p.id)}
                      style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: "pointer", ...display }}
                    >
                      {p.transferListed ? "Unlist" : "List"}
                    </button>
                    {expiring && (
                      <button
                        onClick={() => onRenew(p.id)}
                        style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.gold}`, background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer", ...display, fontWeight: 600 }}
                      >
                        Renew
                      </button>
                    )}
                    {!isCaptain && (
                      <button
                        onClick={() => onSetCaptain(p.id)}
                        style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.inkSoft}`, background: "none", color: PALETTE.inkSoft, cursor: "pointer", ...display }}
                      >
                        Make captain
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TacticsTab({ club, matchday, onChange }) {
  const formations = ["4-4-2", "4-3-3", "3-5-2", "5-3-2", "4-2-3-1"];
  const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const projected = [...startingXI(club, matchday)].sort((a, b) => posOrder[a.position] - posOrder[b.position]);
  const lineRatings = xiLineRatings(projected);

  const Row = ({ label, value, options, field, optionLabels }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(field, opt)}
            style={{
              padding: "8px 14px", borderRadius: 6, cursor: "pointer", ...display, fontSize: 13,
              border: `1.5px solid ${PALETTE.ink}`,
              background: value === opt ? PALETTE.ink : "none",
              color: value === opt ? PALETTE.parchment : PALETTE.ink,
            }}
          >
            {optionLabels ? optionLabels[opt] : opt}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
        Current XI rating
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        {[["DEF", lineRatings.def], ["MID", lineRatings.mid], ["ATT", lineRatings.att]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase" }}>{label}</span>
            <span style={{ color: PALETTE.gold, fontSize: 16 }}><StarRow value={val} /></span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 420, flex: 1, minWidth: 260 }}>
          <Row label="Formation" value={club.tactics.formation} options={formations} field="formation" />
          <Row label="Style" value={club.tactics.style} options={["defensive", "balanced", "attacking"]} field="style" />
          <Row label="Press" value={club.tactics.press} options={["low", "medium", "high"]} field="press" />
          <Row
            label="Lineup Selection"
            value={club.tactics.lineupMode || "best"}
            options={["best", "youth", "auto"]}
            optionLabels={{ best: "Best XI", youth: "Youth", auto: "Auto" }}
            field="lineupMode"
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Projected lineup
          </div>
          {projected.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif }}>
              <span><span style={{ ...mono, color: PALETTE.inkSoft, marginRight: 8, fontSize: 11 }}>{p.position}</span>{p.name}</span>
              <span style={{ ...mono, fontWeight: 700 }}>{p.overall}</span>
            </div>
          ))}
          {projected.length < 11 && (
            <div style={{ fontSize: 12, color: PALETTE.crimson, marginTop: 8, ...serif }}>
              Only {projected.length} available this matchday.
            </div>

        )}
      </div>
      </div>
    </div>
  );
}

function FormBadges({ form }) {
  const colors = { W: "#2E7D32", D: "#9BA8B0", L: PALETTE.crimson };
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {form.map((r, i) => (
        <span key={i} style={{
          width: 18, height: 18, borderRadius: "50%", background: colors[r], color: "#fff",
          fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", ...mono,
        }}>
          {r}
        </span>
      ))}
    </div>
  );
}

function TableTab({ tier, userClubId }) {
  const table = computeTable(tier);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...serif }}>
        <thead>
          <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
            {["#", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts", "Form"].map((h) => (
              <th key={h} style={{ padding: "6px 8px", ...display, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={row.clubId} style={{
              borderBottom: `1px solid ${PALETTE.parchmentDim}`,
              background: row.clubId === userClubId ? `${PALETTE.gold}33` : "transparent",
            }}>
              <td style={{ padding: "6px 8px", ...mono }}>{i + 1}</td>
              <td style={{ padding: "6px 8px", fontWeight: row.clubId === userClubId ? 700 : 400 }}>{row.club}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.played}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.won}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.drawn}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.lost}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.gf}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.ga}</td>
              <td style={{ padding: "6px 8px", ...mono }}>{row.gf - row.ga}</td>
              <td style={{ padding: "6px 8px", ...mono, fontWeight: 700 }}>{row.points}</td>
              <td style={{ padding: "6px 8px" }}><FormBadges form={row.form} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FixturesTab({ tier, userClubId }) {
  const clubName = (id) => tier.clubs.find((c) => c.id === id)?.name ?? "?";
  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  return (
    <div>
      {userFixtures.map((f) => (
        <div key={f.id} style={{
          display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13,
          borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif,
        }}>
          <span style={{ color: PALETTE.inkSoft, ...mono, width: 32 }}>MD{f.matchday}</span>
          <span style={{ flex: 1 }}>{clubName(f.homeClubId)} vs {clubName(f.awayClubId)}</span>
          <span style={{ ...mono, fontWeight: 700 }}>{f.played ? `${f.homeScore} - ${f.awayScore}` : "—"}</span>
        </div>
      ))}
    </div>
  );
}

const MARKET_PAGE_SIZE = 20;

function MarketTab({ tiers, userClub, userTierId, onBuy }) {
  const [sortField, setSortField] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);

  const listed = [];
  tiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id === userClub.id) return;
      c.squad.forEach((p) => {
        if (p.transferListed) listed.push({ player: p, seller: c, tierId: t.id });
      });
    });
  });

  const dir = sortDir === "asc" ? 1 : -1;
  listed.sort((a, b) => {
    const av = sortField === "price" ? a.player.askingPrice : a.player[sortField];
    const bv = sortField === "price" ? b.player.askingPrice : b.player[sortField];
    return (av - bv) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(listed.length / MARKET_PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageItems = listed.slice(clampedPage * MARKET_PAGE_SIZE, (clampedPage + 1) * MARKET_PAGE_SIZE);

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => {
        if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortField(field); setSortDir("desc"); }
        setPage(0);
      }}
      style={{
        fontSize: 11, padding: "5px 10px", borderRadius: 5, cursor: "pointer", ...display,
        border: `1px solid ${sortField === field ? PALETTE.ink : PALETTE.parchmentDim}`,
        background: sortField === field ? PALETTE.ink : "none",
        color: sortField === field ? PALETTE.parchment : PALETTE.inkSoft,
      }}
    >
      {label}{sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        {listed.length} players listed across the pyramid — your budget: ${userClub.budget.toLocaleString()}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <SortButton field="overall" label="Rating" />
        <SortButton field="potential" label="Potential" />
        <SortButton field="age" label="Age" />
        <SortButton field="askingPrice" label="Price" />
      </div>
      {listed.length === 0 && (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "12px 0" }}>
          No players listed right now — check back after the next transfer window.
        </div>
      )}
      {pageItems.map(({ player, seller, tierId }) => {
        const canAfford = userClub.budget >= player.askingPrice;
        return (
          <div key={player.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px",
            borderBottom: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif,
          }}>
            <div>
              <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {player.name}
                <span style={{ ...mono, color: PALETTE.inkSoft, fontWeight: 400 }}>
                  {player.position} · OVR {player.overall} · POT {player.potential} · age {player.age}
                </span>
                <TierBadge tierId={tierId} />
              </div>
              <div style={{ fontSize: 12, color: PALETTE.inkSoft }}>from {seller.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...mono, fontWeight: 700 }}>${player.askingPrice.toLocaleString()}</span>
              <button
                onClick={() => canAfford && onBuy(player.id, seller.id, tierId)}
                disabled={!canAfford}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", cursor: canAfford ? "pointer" : "not-allowed",
                  background: canAfford ? PALETTE.pitch : PALETTE.parchmentDim, color: canAfford ? PALETTE.parchment : PALETTE.inkSoft,
                  ...display, fontSize: 12,
                }}
              >
                Buy
              </button>
            </div>
          </div>
        );
      })}
      {listed.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clampedPage === 0}
            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: clampedPage === 0 ? "not-allowed" : "pointer", opacity: clampedPage === 0 ? 0.4 : 1, ...display, fontSize: 12 }}
          >
            ← Prev
          </button>
          <span style={{ ...mono, fontSize: 12, color: PALETTE.inkSoft }}>
            Page {clampedPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={clampedPage >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: clampedPage >= totalPages - 1 ? "not-allowed" : "pointer", opacity: clampedPage >= totalPages - 1 ? 0.4 : 1, ...display, fontSize: 12 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function TrophyTab({ trophyLog }) {
  if (trophyLog.length === 0) {
    return <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>Nothing here yet — win something.</div>;
  }
  return (
    <div>
      {[...trophyLog].reverse().map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
          <Award size={18} color={PALETTE.gold} />
          <div style={{ ...serif, fontSize: 13 }}>
            <span style={{ fontWeight: 700 }}>Season {t.season}</span> — {t.note}
          </div>
        </div>
      ))}
    </div>
  );
}

function DevelopmentTab({ club, budget, onStartAcademy, onInvestAcademy, onSignYouth, onPromoteYouth, onSellYouth, onHostTryouts, onSignTryout, onDismissTryouts }) {
  if (club.academyEligible) {
    const signCost = academySigningCost(club.academyStars);
    return (
      <div>
        {club.academyStars === 0 ? (
          <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: 16 }}>
            <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.ink, marginBottom: 6 }}>Start an Academy</div>
            <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 12 }}>
              Once started, your academy stays with the club forever — even if you get relegated. It won't come back if you never start one, though.
            </div>
            <button
              onClick={onStartAcademy}
              disabled={budget < ACADEMY_START_COST}
              style={{
                padding: "10px 16px", borderRadius: 6, border: "none", cursor: budget >= ACADEMY_START_COST ? "pointer" : "not-allowed",
                background: budget >= ACADEMY_START_COST ? PALETTE.pitch : PALETTE.parchmentDim, color: budget >= ACADEMY_START_COST ? PALETTE.parchment : PALETTE.inkSoft,
                ...display, fontSize: 13, fontWeight: 600,
              }}
            >
              Start Academy — ${ACADEMY_START_COST.toLocaleString()}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
              <span style={{ ...display, fontSize: 15, fontWeight: 700, color: PALETTE.ink }}>Academy</span>
              <span style={{ color: PALETTE.gold, fontSize: 18 }}><StarRow value={club.academyStars} /></span>
              {club.academyStars < 5 && (
                <button
                  onClick={onInvestAcademy}
                  disabled={budget < ACADEMY_INVEST_INCREMENT}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, cursor: budget >= ACADEMY_INVEST_INCREMENT ? "pointer" : "not-allowed",
                    background: "none", color: budget >= ACADEMY_INVEST_INCREMENT ? PALETTE.ink : PALETTE.inkSoft, ...display, fontSize: 12,
                  }}
                >
                  Invest ${(ACADEMY_INVEST_INCREMENT / 1_000_000).toFixed(1)}M for next tier
                </button>
              )}
              <button
                onClick={onSignYouth}
                disabled={budget < signCost}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", cursor: budget >= signCost ? "pointer" : "not-allowed",
                  background: budget >= signCost ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 600,
                }}
              >
                Sign New Prospect — ${signCost.toLocaleString()}
              </button>
            </div>

            {club.youthPlayers.length === 0 ? (
              <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>No prospects yet — sign one to get started.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...serif }}>
                <thead>
                  <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
                    {["Pos", "Name", "Age", "OVR", "POT", ""].map((h) => (
                      <th key={h} style={{ padding: "6px 8px", ...display, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...club.youthPlayers].sort((a, b) => b.potential - a.potential).map((p) => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                      <td style={{ padding: "6px 8px", ...mono, fontSize: 12 }}>{p.position}</td>
                      <td style={{ padding: "6px 8px", fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: "6px 8px", ...mono }}>{p.age}</td>
                      <td style={{ padding: "6px 8px", ...mono, fontWeight: 700 }}>{p.overall}</td>
                      <td style={{ padding: "6px 8px", ...mono, color: PALETTE.inkSoft }}>{p.potential}</td>
                      <td style={{ padding: "6px 8px", display: "flex", gap: 6 }}>
                        {p.age >= ACADEMY_PROMOTE_MIN_AGE && (
                          <button onClick={() => onPromoteYouth(p.id)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "none", background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer", ...display, fontWeight: 600 }}>
                            Promote
                          </button>
                        )}
                        <button onClick={() => onSellYouth(p.id)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: "pointer", ...display }}>
                          Sell (${youthSaleValue(p).toLocaleString()})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }

  // Not academy-eligible — USL League One / Two clubs run open tryouts instead
  return (
    <div>
      <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 14 }}>
        Your club can't run an academy at this level — but you can host open tryouts for a shot at some free-agent talent.
        Mostly you'll get squad filler, but every so often someone shows up who could play a tier above.
      </div>
      <button
        onClick={onHostTryouts}
        style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600, marginBottom: 16 }}
      >
        Host Tryouts
      </button>
      {club.tryoutCandidates.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>Candidates</span>
            <button onClick={onDismissTryouts} style={{ fontSize: 11, color: PALETTE.inkSoft, background: "none", border: "none", cursor: "pointer", ...display }}>Dismiss all</button>
          </div>
          {club.tryoutCandidates.map((p) => {
            const cost = tryoutSigningCost(p.overall);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>{" "}
                  <span style={{ ...mono, color: PALETTE.inkSoft }}>{p.position} · OVR {p.overall} · age {p.age}</span>
                </div>
                <button
                  onClick={() => onSignTryout(p.id)}
                  disabled={budget < cost}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "none", cursor: budget >= cost ? "pointer" : "not-allowed",
                    background: budget >= cost ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 600,
                  }}
                >
                  Sign — ${cost.toLocaleString()}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DASHBOARD SHELL
   ============================================================ */

const TABS = [
  { id: "squad", label: "Squad", icon: Users },
  { id: "tactics", label: "Tactics", icon: Sliders },
  { id: "table", label: "Table", icon: Trophy },
  { id: "fixtures", label: "Fixtures", icon: Calendar },
  { id: "market", label: "Market", icon: ShoppingBag },
  { id: "development", label: "Development", icon: GraduationCap },
  { id: "trophies", label: "Trophy Room", icon: Award },
];

function DraftModal({ picks, onKeep, onSell }) {
  if (!picks || picks.length === 0) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 46, padding: 20 }}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 460, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 24 }}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 4 }}>
          Draft
        </div>
        <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 16 }}>
          You have {picks.length} pick{picks.length === 1 ? "" : "s"} to resolve. Keep a prospect for your squad, or sell the pick for cash.
        </div>
        {picks.map((pick, i) => {
          const value = draftProspectValue(pick.prospect);
          return (
            <div key={pick.prospect.id} style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ ...display, fontWeight: 700, fontSize: 15, color: PALETTE.ink, marginBottom: 2 }}>
                Round {pick.round} pick — {TIER_META[pick.tierIdx].short}
              </div>
              <div style={{ ...serif, fontSize: 13, color: PALETTE.ink, marginBottom: 10 }}>
                {pick.prospect.name} — <span style={{ ...mono }}>{pick.prospect.position} · OVR {pick.prospect.overall} · POT {pick.prospect.potential} · age {pick.prospect.age}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => onKeep(i)}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600 }}
                >
                  Keep
                </button>
                <button
                  onClick={() => onSell(i)}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", color: PALETTE.ink, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600 }}
                >
                  Sell for ${value.toLocaleString()}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoNotice({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 47, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 380, width: "100%", padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, marginBottom: 16 }}>{message}</div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function RenewalNotice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 400, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 10 }}>
          {notice.accepted ? "Contract renewed" : "Renewal rejected"}
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.inkSoft, marginBottom: 16 }}>
          {notice.accepted
            ? `${notice.playerName} signed a new 2-year deal for a $${notice.cost.toLocaleString()} bonus.`
            : `${notice.playerName} turned it down — ${notice.reason}${notice.cost ? ` (asking around $${notice.cost.toLocaleString()})` : ""}.`}
        </div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function WindowNotice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 400, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 10 }}>
          {notice.seasonEnded ? "Season complete" : "Transfer window open"}
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.inkSoft, marginBottom: 16 }}>
          {notice.seasonEnded
            ? "No more windows this season — roll over to kick off the next one."
            : `${notice.listedCount} player${notice.listedCount === 1 ? "" : "s"} listed and ${notice.transferCount} deal${notice.transferCount === 1 ? "" : "s"} done across the pyramid while you weren't looking. Check the Market tab.`}
        </div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function getCurrentMatchday(next) {
  const tier = next.tiers[next.userTierId];
  const remaining = tier.fixtures.filter((f) => !f.played);
  return remaining.length ? remaining[0].matchday : null;
}

function simulateMatchdayAcrossTiers(next, currentMatchday) {
  const matches = [];
  next.tiers.forEach((t) => {
    // recovery between matchdays for the whole squad — starters net a small
    // amount of fatigue, rested players climb back toward full fitness
    t.clubs.forEach((c) => c.squad.forEach((p) => { p.fitness = clamp(p.fitness + 18, 0, 100); }));

    const todays = t.fixtures.filter((f) => f.matchday === currentMatchday && !f.played);
    todays.forEach((fx) => {
      const home = t.clubs.find((c) => c.id === fx.homeClubId);
      const away = t.clubs.find((c) => c.id === fx.awayClubId);
      if (!home || !away) return;
      const result = simulateMatch(fx, home, away, currentMatchday);
      if (t.id === next.userTierId) matches.push(result);
    });
    // light responsiveness pass: an already-listed player might get snapped up between windows
    t.clubs.forEach((seller) => {
      seller.squad.forEach((p) => {
        if (p.transferListed && Math.random() < 0.08) {
          const buyers = t.clubs.filter((c) => c.id !== seller.id && c.budget >= p.askingPrice && c.squad.length < 26);
          if (buyers.length === 0) return;
          const buyer = choice(buyers);
          buyer.budget -= p.askingPrice;
          seller.budget += p.askingPrice;
          p.transferListed = false;
          p.askingPrice = null;
          seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
          buyer.squad.push(p);
        }
      });
    });
  });
  return matches;
}

function maybeTriggerMidWindow(next, justPlayedMatchday) {
  if (justPlayedMatchday !== MID_SEASON_WINDOW_MATCHDAY - 1) return null;
  if (next.midWindowSeason === next.seasonNumber) return null;
  const result = runTransferWindow(next.tiers, next.userClubId);
  next.midWindowSeason = next.seasonNumber;
  return result;
}

function Dashboard({ state, setState, onNewGame }) {
  const [tab, setTab] = useState("squad");
  const [recap, setRecap] = useState(null);
  const [windowNotice, setWindowNotice] = useState(null);
  const [rollover, setRollover] = useState(null);
  const [renewalNotice, setRenewalNotice] = useState(null);
  const [draftPicks, setDraftPicks] = useState(null);
  const [infoNotice, setInfoNotice] = useState(null);

  const tier = state.tiers[state.userTierId];
  const userClub = tier.clubs.find((c) => c.id === state.userClubId);
  const nextMatchdayFixtures = tier.fixtures.filter((f) => !f.played);
  const currentMatchday = nextMatchdayFixtures.length > 0 ? nextMatchdayFixtures[0].matchday : null;
  const seasonComplete = currentMatchday === null;

  const mutateAndSave = useCallback((mutator) => {
    setState((prev) => {
      const next = { ...prev, tiers: prev.tiers.map((t) => ({ ...t, clubs: t.clubs.map((c) => ({ ...c, squad: [...c.squad] })), fixtures: [...t.fixtures] })) };
      mutator(next);
      return next;
    });
  }, [setState]);

  const simulateMatchday = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      const matches = simulateMatchdayAcrossTiers(next, currentMatchday);
      const w = maybeTriggerMidWindow(next, currentMatchday);
      setRecap({ matchday: currentMatchday, matches });
      if (w) setWindowNotice(w);
    });
  };

  const simulateSeason = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      while (md !== null) {
        simulateMatchdayAcrossTiers(next, md);
        maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
      }
    });
  };

  const simulateToNextWindow = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      let fired = null;
      while (md !== null) {
        simulateMatchdayAcrossTiers(next, md);
        fired = maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
        if (fired) break;
      }
      setWindowNotice(fired ? fired : { seasonEnded: true });
    });
  };

  const doRollover = () => {
    const { newTiers, events, windowResult, newPrizePools, userPrize, userRetirements, userDraftPicks } = rolloverSeason(state.tiers, state.userClubId, state.prizePools);
    const userMove = events.find((e) => e.clubId === state.userClubId && e.type !== "champion");
    const userChamp = events.find((e) => e.clubId === state.userClubId && e.type === "champion");
    const trophyEntries = [];
    if (userChamp) trophyEntries.push({ season: state.seasonNumber, note: `Won the ${TIER_META[userChamp.tier].name} title` });
    if (userMove) trophyEntries.push({ season: state.seasonNumber, note: userMove.type === "promoted" ? `Promoted to ${TIER_META[userMove.to].name}` : `Relegated to ${TIER_META[userMove.to].name}` });

    setState((prev) => ({
      ...prev,
      tiers: newTiers,
      userTierId: userMove ? userMove.to : prev.userTierId,
      seasonNumber: prev.seasonNumber + 1,
      trophyLog: [...prev.trophyLog, ...trophyEntries],
      midWindowSeason: prev.midWindowSeason,
      prizePools: newPrizePools,
    }));
    setRollover({ events, seasonNumber: state.seasonNumber, windowResult, userPrize, ownershipDeposit: OWNERSHIP_DEPOSIT[state.userTierId], userRetirements });
    if (userDraftPicks && userDraftPicks.length) setDraftPicks(userDraftPicks);
  };

  const handleToggleList = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      p.transferListed = !p.transferListed;
      p.askingPrice = p.transferListed ? marketValue(p) : null;
    });
  };

  const handleRenew = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (!p) return;
      const outcome = renewalOutcome(p, club.budget);
      if (!outcome.accepted) {
        setRenewalNotice({ playerName: p.name, accepted: false, reason: outcome.reason, cost: outcome.cost });
        return;
      }
      club.budget -= outcome.cost;
      p.contractYearsLeft += 2;
      p.wage = Math.round(p.wage * 1.1);
      setRenewalNotice({ playerName: p.name, accepted: true, cost: outcome.cost });
    });
  };

  const handleSetCaptain = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.captainId = playerId;
    });
  };

  const handleDraftKeep = (pickIndex) => {
    const pick = draftPicks[pickIndex];
    if (!pick) return;
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell the pick instead, or free up a roster spot first.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.squad.push(pick.prospect);
    });
    setDraftPicks((prev) => prev.filter((_, i) => i !== pickIndex));
  };

  const handleDraftSell = (pickIndex) => {
    const pick = draftPicks[pickIndex];
    if (!pick) return;
    const value = draftProspectValue(pick.prospect);
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.budget += value;
    });
    setDraftPicks((prev) => prev.filter((_, i) => i !== pickIndex));
  };

  const handleBuy = (playerId, sellerId, sellerTierId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before buying.`);
      return;
    }
    mutateAndSave((next) => {
      const buyerTier = next.tiers[next.userTierId];
      const buyer = buyerTier.clubs.find((c) => c.id === next.userClubId);
      const sourceTier = next.tiers[sellerTierId] ?? next.tiers.find((t) => t.clubs.some((c) => c.id === sellerId));
      const seller = sourceTier?.clubs.find((c) => c.id === sellerId);
      if (!seller) return;
      const p = seller.squad.find((pl) => pl.id === playerId);
      if (!p || buyer.budget < p.askingPrice) return;
      buyer.budget -= p.askingPrice;
      seller.budget += p.askingPrice;
      p.transferListed = false;
      p.askingPrice = null;
      seller.squad = seller.squad.filter((pl) => pl.id !== playerId);
      buyer.squad.push(p);
    });
  };

  const handleStartAcademy = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      if (!club.academyEligible || club.academyStars > 0 || club.budget < ACADEMY_START_COST) return;
      club.budget -= ACADEMY_START_COST;
      club.academyInvested = ACADEMY_START_COST;
      club.academyStars = 1;
    });
  };

  const handleInvestAcademy = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      if (club.academyStars <= 0 || club.academyStars >= 5 || club.budget < ACADEMY_INVEST_INCREMENT) return;
      club.budget -= ACADEMY_INVEST_INCREMENT;
      club.academyInvested += ACADEMY_INVEST_INCREMENT;
      club.academyStars = academyStarsForInvestment(club.academyInvested);
    });
  };

  const handleSignYouth = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const cost = academySigningCost(club.academyStars);
      if (club.academyStars <= 0 || club.budget < cost) return;
      club.budget -= cost;
      club.youthPlayers = [...club.youthPlayers, generateAcademyProspect(club.academyStars)];
    });
  };

  const handlePromoteYouth = (playerId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before promoting.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.youthPlayers.find((yp) => yp.id === playerId);
      if (!p || p.age < ACADEMY_PROMOTE_MIN_AGE) return;
      club.youthPlayers = club.youthPlayers.filter((yp) => yp.id !== playerId);
      club.squad.push(promoteYouthToFirstTeam(p));
    });
  };

  const handleSellYouth = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.youthPlayers.find((yp) => yp.id === playerId);
      if (!p) return;
      club.budget += youthSaleValue(p);
      club.youthPlayers = club.youthPlayers.filter((yp) => yp.id !== playerId);
    });
  };

  const handleHostTryouts = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const cost = tryoutCost(next.userTierId);
      if (club.academyEligible || club.budget < cost) return;
      club.budget -= cost;
      club.tryoutCandidates = generateTryoutCandidates(next.userTierId);
    });
  };

  const handleSignTryoutCandidate = (playerId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before signing.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.tryoutCandidates.find((c) => c.id === playerId);
      const cost = p ? tryoutSigningCost(p.overall) : 0;
      if (!p || club.budget < cost) return;
      club.budget -= cost;
      club.squad.push(p);
      club.tryoutCandidates = club.tryoutCandidates.filter((c) => c.id !== playerId);
    });
  };

  const handleDismissTryouts = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.tryoutCandidates = [];
    });
  };

  const handleTacticsChange = (field, value) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.tactics = { ...club.tactics, [field]: value };
    });
  };

  const avgOvr = Math.round(userClub.squad.reduce((s, p) => s + p.overall, 0) / userClub.squad.length);

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.parchment, ...serif }}>
      <style>{FONT_IMPORT}</style>

      {/* header */}
      <div style={{ background: PALETTE.pitch, color: PALETTE.parchment, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Crest name={userClub.name} size={44} />
          <div>
            <div style={{ ...display, fontSize: 20, fontWeight: 700 }}>{userClub.name}</div>
            <div style={{ fontSize: 12, opacity: 0.8, display: "flex", gap: 8, alignItems: "center" }}>
              <TierBadge tierId={state.userTierId} /> OVR {avgOvr} · ${userClub.budget.toLocaleString()}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
            Season {state.seasonNumber}<br />
            {seasonComplete ? "Season complete" : `Matchday ${currentMatchday}`}
          </div>
          {seasonComplete ? (
            <button
              onClick={doRollover}
              style={{ ...display, fontWeight: 600, fontSize: 13, background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 16px", cursor: "pointer" }}
            >
              Roll over season →
            </button>
          ) : (
            <>
              <button
                onClick={simulateMatchday}
                style={{ ...display, fontWeight: 600, fontSize: 13, background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 14px", cursor: "pointer" }}
              >
                Sim Matchday
              </button>
              <button
                onClick={simulateToNextWindow}
                style={{ ...display, fontWeight: 600, fontSize: 12.5, background: "none", color: PALETTE.parchment, border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px 12px", cursor: "pointer" }}
              >
                Sim to Next Window
              </button>
              <button
                onClick={simulateSeason}
                style={{ ...display, fontWeight: 600, fontSize: 12.5, background: "none", color: PALETTE.parchment, border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px 12px", cursor: "pointer" }}
              >
                Sim Season
              </button>
            </>
          )}
          <button onClick={onNewGame} title="Abandon career" style={{ background: "none", border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px", cursor: "pointer" }}>
            <RotateCcw size={16} color={PALETTE.parchment} />
          </button>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, padding: "10px 24px 0", borderBottom: `2px solid ${PALETTE.parchmentDim}`, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none",
                background: "none", cursor: "pointer", ...display, fontSize: 13,
                color: active ? PALETTE.ink : PALETTE.inkSoft, fontWeight: active ? 700 : 500,
                borderBottom: active ? `3px solid ${PALETTE.gold}` : "3px solid transparent",
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        {tab === "squad" && <SquadTab club={userClub} matchday={currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1)} onToggleList={handleToggleList} onRenew={handleRenew} onSetCaptain={handleSetCaptain} />}
        {tab === "tactics" && <TacticsTab club={userClub} matchday={currentMatchday ?? 1} onChange={handleTacticsChange} />}
        {tab === "table" && <TableTab tier={tier} userClubId={userClub.id} />}
        {tab === "fixtures" && <FixturesTab tier={tier} userClubId={userClub.id} />}
        {tab === "market" && <MarketTab tiers={state.tiers} userClub={userClub} userTierId={state.userTierId} onBuy={handleBuy} />}
        {tab === "development" && (
          <DevelopmentTab
            club={userClub}
            budget={userClub.budget}
            onStartAcademy={handleStartAcademy}
            onInvestAcademy={handleInvestAcademy}
            onSignYouth={handleSignYouth}
            onPromoteYouth={handlePromoteYouth}
            onSellYouth={handleSellYouth}
            onHostTryouts={handleHostTryouts}
            onSignTryout={handleSignTryoutCandidate}
            onDismissTryouts={handleDismissTryouts}
          />
        )}
        {tab === "trophies" && <TrophyTab trophyLog={state.trophyLog} />}
      </div>

      {recap && <MatchdayRecap results={recap} userClubName={userClub.name} onClose={() => setRecap(null)} />}
      {windowNotice && <WindowNotice notice={windowNotice} onClose={() => setWindowNotice(null)} />}
      {renewalNotice && <RenewalNotice notice={renewalNotice} onClose={() => setRenewalNotice(null)} />}
      {infoNotice && <InfoNotice message={infoNotice} onClose={() => setInfoNotice(null)} />}
      {!rollover && draftPicks && draftPicks.length > 0 && (
        <DraftModal picks={draftPicks} onKeep={handleDraftKeep} onSell={handleDraftSell} />
      )}
      {rollover && (
        <RolloverModal
          events={rollover.events}
          userClubId={state.userClubId}
          seasonNumber={rollover.seasonNumber}
          windowResult={rollover.windowResult}
          userPrize={rollover.userPrize}
          ownershipDeposit={rollover.ownershipDeposit}
          userRetirements={rollover.userRetirements}
          onContinue={() => setRollover(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   ROOT APP — persistence + screen routing
   ============================================================ */

const STORAGE_KEY = "ascent_career_v1";
// Bump this whenever a code change reshapes the save data (new required
// fields on Club/Player, tier count changes, etc.). Old saves that don't
// match get reset instead of crashing the app on load.
const SAVE_VERSION = 1;

function isValidSave(parsed) {
  return (
    parsed &&
    parsed.saveVersion === SAVE_VERSION &&
    Array.isArray(parsed.tiers) &&
    parsed.tiers.length === 4 &&
    typeof parsed.userClubId === "string" &&
    typeof parsed.userTierId === "number"
  );
}

export default function App() {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveWasReset, setSaveWasReset] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidSave(parsed)) {
          setState(parsed);
        } else {
          // save exists but doesn't match what this version of the game
          // expects — don't risk crashing on a half-matching shape
          localStorage.removeItem(STORAGE_KEY);
          setSaveWasReset(true);
        }
      }
    } catch (e) {
      // corrupt/unreadable save — same treatment, start fresh
      try { localStorage.removeItem(STORAGE_KEY); } catch (e2) {}
      setSaveWasReset(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, saveVersion: SAVE_VERSION }));
    } catch (e) {
      // best-effort — e.g. storage full or disabled
    }
  }, [state, loaded]);

  const handleNewGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setState(null);
  };

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: PALETTE.pitchDark }} />;
  }

  if (!state) {
    const previewWorld = buildInitialWorld();
    previewWorld.forEach((t) => { t.fixtures = generateRoundRobin(t.clubs.map((c) => c.id)); });
    return <ClubSelectScreen world={previewWorld} saveWasReset={saveWasReset} onPick={(tierId, clubId) => {
      // re-derive the same picked club/tier from a freshly built world containing it
      handlePickFromPreview(previewWorld, tierId, clubId, setState);
    }} />;
  }

  return <Dashboard state={state} setState={setState} onNewGame={handleNewGame} />;
}

function handlePickFromPreview(previewWorld, tierId, clubId, setState) {
  setState({
    saveVersion: SAVE_VERSION,
    tiers: previewWorld,
    userTierId: tierId,
    userClubId: clubId,
    seasonNumber: 1,
    trophyLog: [],
    midWindowSeason: 0,
    prizePools: [3_000_000, 1_200_000, 500_000, 200_000],
  });
}
