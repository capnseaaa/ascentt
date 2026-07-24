import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Trophy, TrendingUp, TrendingDown, Users, Sliders, Calendar, ShoppingBag, Award, ChevronRight, X, ArrowUpCircle, ArrowDownCircle, RotateCcw, GraduationCap, Lightbulb, DollarSign, Star } from "lucide-react";

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
// Fisher-Yates — used for random knockout pairings (e.g. the US Open Cup)
// where seeding isn't based on standings, just a blind draw.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
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

/* ============================================================
   DIFFICULTY MODES & REALISTIC WAGES
   ============================================================ */

const DIFFICULTY_MODES = {
  rookie: { label: "Rookie", wagesDeducted: false, eventBonuses: false, boardPressure: false, dps: false, injuryMultiplier: 0.5 },
  pro: { label: "Pro", wagesDeducted: true, eventBonuses: true, boardPressure: false, dps: false, injuryMultiplier: 1.0 },
  executive: { label: "Executive", wagesDeducted: true, eventBonuses: true, boardPressure: true, dps: true, injuryMultiplier: 1.0 },
};

// Annual wage bands per tier, loosely calibrated to real USL/MLS CBA figures.
// USL League Two pays nothing — it's amateur/NCAA-eligible status, by rule.
const WAGE_BANDS = [
  { young: 90_000, senior: 126_000, vetLow: 250_000, vetHigh: 600_000, starLow: 700_000, starHigh: 9_000_000 }, // MLS
  { young: 34_000, senior: 42_000, vetLow: 50_000, vetHigh: 60_000, starLow: 96_000, starHigh: 180_000 }, // USL Championship
  { young: 15_000, senior: 20_000, vetLow: 24_000, vetHigh: 36_000, starLow: 36_000, starHigh: 55_000 }, // USL League One
  { young: 0, senior: 0, vetLow: 0, vetHigh: 0, starLow: 0, starHigh: 0 }, // USL League Two — amateur
];

function computeRealisticWage(overall, age, tierIdx) {
  const b = WAGE_BANDS[tierIdx] ?? WAGE_BANDS[3];
  if (b.starHigh === 0) return 0;
  if (overall >= 82) {
    const t = clamp((overall - 82) / 13, 0, 1);
    return Math.round(b.starLow + t * (b.starHigh - b.starLow));
  }
  if (age <= 23) return b.young;
  if (overall <= 65) return b.senior;
  const t = clamp((overall - 65) / 17, 0, 1);
  return Math.round(b.vetLow + t * (b.vetHigh - b.vetLow));
}

function squadPayroll(squad) {
  return squad.reduce((s, p) => s + (p.wage || 0), 0);
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
    wage: Math.round(rating * 50), // crude placeholder — corrected to a real tier-scaled wage the first time it passes through rolloverSeason
    wageSet: false,
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

// ============================================================
// ENGLAND (IN PROGRESS) — not yet wired into the country selector.
// Real 2026-27 Premier League club list confirmed via research:
// promoted Coventry City / Ipswich Town / Hull City replacing
// relegated West Ham United / Burnley / Wolverhampton Wanderers.
// PREMIER_LEAGUE_CLUBS is the full 20-club name list; ENGLAND_ROSTERS
// currently has real, researched 2025-26 rosters for 6 of those clubs
// (the rest still need the same research pass MLS/these six got).
// Ratings are calibrated against real FIFA/EA FC-style overalls, NOT
// rescaled to MLS's numeric range — the Premier League is a genuinely
// stronger league than MLS, so its numbers run higher on purpose.
// ============================================================
const PREMIER_LEAGUE_CLUBS = ["Arsenal FC", "Aston Villa FC", "AFC Bournemouth", "Brentford FC", "Brighton & Hove Albion FC", "Chelsea FC", "Crystal Palace FC", "Everton FC", "Fulham FC", "Leeds United FC", "Liverpool FC", "Manchester City FC", "Manchester United FC", "Newcastle United FC", "Nottingham Forest FC", "Sunderland AFC", "Tottenham Hotspur FC", "Coventry City FC", "Ipswich Town FC", "Hull City AFC"];

// Confirmed 2026-27 EFL Championship 24-club list (real, researched).
// Rosters not yet researched — Premier League tier is done, Championship
// is the next big research push (24 clubs, same depth as PL took).
const CHAMPIONSHIP_CLUBS = ["Birmingham City", "Queens Park Rangers", "Bristol City", "Sheffield United", "Burnley", "Wolverhampton Wanderers", "Derby County", "Stoke City", "Middlesbrough", "Cardiff City", "Millwall", "Lincoln City", "Norwich City", "Portsmouth", "Southampton", "Bolton Wanderers", "Swansea City", "West Ham United", "Watford", "Charlton Athletic", "West Bromwich Albion", "Blackburn Rovers", "Wrexham", "Preston North End"];

const ENGLAND_ROSTERS = {"arsenal": {"name": "Arsenal FC", "players": [{"name": "David Raya", "position": "GK", "age": 30, "overall": 86, "potential": 86, "pace": 66, "shooting": 45, "passing": 72, "defense": 60, "physical": 80}, {"name": "Kepa Arrizabalaga", "position": "GK", "age": 31, "overall": 79, "potential": 79, "pace": 64, "shooting": 44, "passing": 68, "defense": 55, "physical": 78}, {"name": "William Saliba", "position": "DEF", "age": 24, "overall": 87, "potential": 89, "pace": 68, "shooting": 42, "passing": 68, "defense": 86, "physical": 84}, {"name": "Gabriel Magalhaes", "position": "DEF", "age": 27, "overall": 85, "potential": 85, "pace": 62, "shooting": 48, "passing": 64, "defense": 85, "physical": 83}, {"name": "Cristhian Mosquera", "position": "DEF", "age": 21, "overall": 76, "potential": 83, "pace": 70, "shooting": 38, "passing": 62, "defense": 75, "physical": 74}, {"name": "Jurrien Timber", "position": "DEF", "age": 24, "overall": 83, "potential": 86, "pace": 79, "shooting": 52, "passing": 72, "defense": 80, "physical": 73}, {"name": "Oleksandr Zinchenko", "position": "DEF", "age": 28, "overall": 80, "potential": 80, "pace": 68, "shooting": 48, "passing": 80, "defense": 68, "physical": 60}, {"name": "Takehiro Tomiyasu", "position": "DEF", "age": 26, "overall": 79, "potential": 80, "pace": 66, "shooting": 42, "passing": 68, "defense": 76, "physical": 75}, {"name": "Martin Zubimendi", "position": "MID", "age": 26, "overall": 84, "potential": 86, "pace": 62, "shooting": 58, "passing": 84, "defense": 78, "physical": 68}, {"name": "Christian Norgaard", "position": "MID", "age": 31, "overall": 78, "potential": 78, "pace": 54, "shooting": 52, "passing": 73, "defense": 75, "physical": 78}, {"name": "Viktor Gyokeres", "position": "FWD", "age": 27, "overall": 84, "potential": 86, "pace": 80, "shooting": 86, "passing": 66, "defense": 42, "physical": 84}, {"name": "Noni Madueke", "position": "FWD", "age": 23, "overall": 80, "potential": 85, "pace": 86, "shooting": 74, "passing": 68, "defense": 38, "physical": 66}, {"name": "Ben White", "position": "DEF", "age": 27, "overall": 82, "potential": 82, "pace": 72, "shooting": 52, "passing": 72, "defense": 80, "physical": 72}, {"name": "Gabriel Jesus", "position": "FWD", "age": 28, "overall": 78, "potential": 78, "pace": 74, "shooting": 74, "passing": 70, "defense": 38, "physical": 68}, {"name": "Bukayo Saka", "position": "FWD", "age": 23, "overall": 88, "potential": 90, "pace": 86, "shooting": 80, "passing": 84, "defense": 44, "physical": 64}, {"name": "Martin Odegaard", "position": "MID", "age": 26, "overall": 86, "potential": 86, "pace": 68, "shooting": 76, "passing": 88, "defense": 52, "physical": 58}, {"name": "Gabriel Martinelli", "position": "FWD", "age": 24, "overall": 82, "potential": 85, "pace": 88, "shooting": 76, "passing": 70, "defense": 38, "physical": 60}, {"name": "Jakub Kiwior", "position": "DEF", "age": 25, "overall": 76, "potential": 80, "pace": 68, "shooting": 44, "passing": 62, "defense": 76, "physical": 76}, {"name": "Leandro Trossard", "position": "FWD", "age": 30, "overall": 78, "potential": 78, "pace": 72, "shooting": 74, "passing": 72, "defense": 42, "physical": 58}, {"name": "Fabio Vieira", "position": "MID", "age": 25, "overall": 73, "potential": 77, "pace": 66, "shooting": 60, "passing": 74, "defense": 44, "physical": 54}, {"name": "Ethan Nwaneri", "position": "MID", "age": 18, "overall": 74, "potential": 88, "pace": 74, "shooting": 64, "passing": 74, "defense": 44, "physical": 56}, {"name": "Mikel Merino", "position": "MID", "age": 29, "overall": 80, "potential": 80, "pace": 66, "shooting": 66, "passing": 74, "defense": 68, "physical": 74}, {"name": "Reiss Nelson", "position": "FWD", "age": 25, "overall": 71, "potential": 73, "pace": 78, "shooting": 64, "passing": 64, "defense": 36, "physical": 58}, {"name": "Kai Havertz", "position": "FWD", "age": 26, "overall": 83, "potential": 83, "pace": 68, "shooting": 78, "passing": 76, "defense": 50, "physical": 74}, {"name": "Karl Hein", "position": "GK", "age": 23, "overall": 68, "potential": 74, "pace": 56, "shooting": 40, "passing": 60, "defense": 42, "physical": 72}, {"name": "Riccardo Calafiori", "position": "DEF", "age": 23, "overall": 80, "potential": 86, "pace": 74, "shooting": 54, "passing": 74, "defense": 76, "physical": 74}, {"name": "Declan Rice", "position": "MID", "age": 26, "overall": 87, "potential": 88, "pace": 68, "shooting": 66, "passing": 80, "defense": 84, "physical": 80}, {"name": "Eberechi Eze", "position": "MID", "age": 27, "overall": 82, "potential": 83, "pace": 78, "shooting": 76, "passing": 78, "defense": 42, "physical": 60}, {"name": "Piero Hincapie", "position": "DEF", "age": 23, "overall": 78, "potential": 84, "pace": 72, "shooting": 44, "passing": 62, "defense": 78, "physical": 78}]}, "manchester_city": {"name": "Manchester City FC", "players": [{"name": "Gianluigi Donnarumma", "position": "GK", "age": 26, "overall": 89, "potential": 90, "pace": 58, "shooting": 42, "passing": 76, "defense": 58, "physical": 84}, {"name": "James Trafford", "position": "GK", "age": 23, "overall": 78, "potential": 84, "pace": 60, "shooting": 44, "passing": 70, "defense": 52, "physical": 76}, {"name": "Ruben Dias", "position": "DEF", "age": 28, "overall": 87, "potential": 88, "pace": 60, "shooting": 44, "passing": 66, "defense": 88, "physical": 84}, {"name": "Josko Gvardiol", "position": "DEF", "age": 23, "overall": 86, "potential": 90, "pace": 72, "shooting": 54, "passing": 74, "defense": 84, "physical": 81}, {"name": "Marc Guehi", "position": "DEF", "age": 25, "overall": 82, "potential": 86, "pace": 64, "shooting": 42, "passing": 64, "defense": 80, "physical": 76}, {"name": "Rayan Ait-Nouri", "position": "DEF", "age": 24, "overall": 81, "potential": 85, "pace": 82, "shooting": 58, "passing": 72, "defense": 74, "physical": 68}, {"name": "Nathan Ake", "position": "DEF", "age": 30, "overall": 80, "potential": 80, "pace": 64, "shooting": 44, "passing": 68, "defense": 78, "physical": 78}, {"name": "Abdukodir Khusanov", "position": "DEF", "age": 21, "overall": 76, "potential": 83, "pace": 74, "shooting": 38, "passing": 58, "defense": 74, "physical": 72}, {"name": "Rodri", "position": "MID", "age": 29, "overall": 91, "potential": 91, "pace": 58, "shooting": 73, "passing": 88, "defense": 86, "physical": 82}, {"name": "Bernardo Silva", "position": "MID", "age": 31, "overall": 87, "potential": 87, "pace": 74, "shooting": 74, "passing": 86, "defense": 64, "physical": 58}, {"name": "Tijjani Reijnders", "position": "MID", "age": 27, "overall": 84, "potential": 86, "pace": 72, "shooting": 72, "passing": 80, "defense": 68, "physical": 74}, {"name": "Rayan Cherki", "position": "MID", "age": 22, "overall": 82, "potential": 88, "pace": 68, "shooting": 72, "passing": 82, "defense": 42, "physical": 52}, {"name": "Phil Foden", "position": "MID", "age": 25, "overall": 87, "potential": 90, "pace": 78, "shooting": 80, "passing": 84, "defense": 58, "physical": 62}, {"name": "Matheus Nunes", "position": "MID", "age": 27, "overall": 81, "potential": 83, "pace": 80, "shooting": 66, "passing": 74, "defense": 66, "physical": 72}, {"name": "Erling Haaland", "position": "FWD", "age": 26, "overall": 91, "potential": 92, "pace": 82, "shooting": 92, "passing": 66, "defense": 46, "physical": 90}, {"name": "Jeremy Doku", "position": "FWD", "age": 23, "overall": 85, "potential": 89, "pace": 94, "shooting": 74, "passing": 70, "defense": 36, "physical": 68}, {"name": "Omar Marmoush", "position": "FWD", "age": 26, "overall": 82, "potential": 84, "pace": 84, "shooting": 78, "passing": 68, "defense": 36, "physical": 72}, {"name": "Mateo Kovacic", "position": "MID", "age": 31, "overall": 80, "potential": 80, "pace": 64, "shooting": 62, "passing": 78, "defense": 72, "physical": 68}, {"name": "Savinho", "position": "FWD", "age": 21, "overall": 79, "potential": 86, "pace": 86, "shooting": 68, "passing": 72, "defense": 38, "physical": 58}, {"name": "Oscar Bobb", "position": "FWD", "age": 22, "overall": 75, "potential": 83, "pace": 84, "shooting": 66, "passing": 68, "defense": 36, "physical": 58}, {"name": "John Stones", "position": "DEF", "age": 31, "overall": 80, "potential": 80, "pace": 60, "shooting": 42, "passing": 68, "defense": 80, "physical": 74}, {"name": "Nico Gonzalez", "position": "MID", "age": 23, "overall": 74, "potential": 80, "pace": 68, "shooting": 54, "passing": 70, "defense": 68, "physical": 64}, {"name": "Marcus Bettinelli", "position": "GK", "age": 33, "overall": 66, "potential": 66, "pace": 50, "shooting": 38, "passing": 58, "defense": 38, "physical": 70}, {"name": "Stefan Ortega", "position": "GK", "age": 32, "overall": 78, "potential": 78, "pace": 56, "shooting": 42, "passing": 68, "defense": 50, "physical": 76}]}, "liverpool": {"name": "Liverpool FC", "players": [{"name": "Alisson", "position": "GK", "age": 33, "overall": 88, "potential": 88, "pace": 60, "shooting": 44, "passing": 74, "defense": 58, "physical": 80}, {"name": "Giorgi Mamardashvili", "position": "GK", "age": 25, "overall": 82, "potential": 86, "pace": 58, "shooting": 42, "passing": 66, "defense": 52, "physical": 82}, {"name": "Virgil van Dijk", "position": "DEF", "age": 34, "overall": 88, "potential": 88, "pace": 68, "shooting": 58, "passing": 74, "defense": 90, "physical": 86}, {"name": "Ibrahima Konate", "position": "DEF", "age": 26, "overall": 84, "potential": 86, "pace": 78, "shooting": 50, "passing": 64, "defense": 84, "physical": 82}, {"name": "Joe Gomez", "position": "DEF", "age": 28, "overall": 78, "potential": 78, "pace": 72, "shooting": 38, "passing": 62, "defense": 76, "physical": 76}, {"name": "Milos Kerkez", "position": "DEF", "age": 22, "overall": 81, "potential": 86, "pace": 84, "shooting": 54, "passing": 72, "defense": 72, "physical": 68}, {"name": "Conor Bradley", "position": "DEF", "age": 22, "overall": 78, "potential": 84, "pace": 80, "shooting": 52, "passing": 68, "defense": 74, "physical": 66}, {"name": "Jeremie Frimpong", "position": "DEF", "age": 24, "overall": 82, "potential": 86, "pace": 94, "shooting": 66, "passing": 68, "defense": 68, "physical": 64}, {"name": "Andy Robertson", "position": "DEF", "age": 31, "overall": 82, "potential": 82, "pace": 72, "shooting": 52, "passing": 78, "defense": 78, "physical": 72}, {"name": "Florian Wirtz", "position": "MID", "age": 22, "overall": 87, "potential": 92, "pace": 80, "shooting": 78, "passing": 86, "defense": 52, "physical": 58}, {"name": "Dominik Szoboszlai", "position": "MID", "age": 24, "overall": 85, "potential": 87, "pace": 78, "shooting": 78, "passing": 82, "defense": 62, "physical": 72}, {"name": "Alexis Mac Allister", "position": "MID", "age": 26, "overall": 86, "potential": 88, "pace": 68, "shooting": 78, "passing": 86, "defense": 66, "physical": 64}, {"name": "Federico Chiesa", "position": "MID", "age": 27, "overall": 81, "potential": 82, "pace": 80, "shooting": 74, "passing": 68, "defense": 40, "physical": 66}, {"name": "Curtis Jones", "position": "MID", "age": 24, "overall": 80, "potential": 84, "pace": 70, "shooting": 64, "passing": 74, "defense": 58, "physical": 64}, {"name": "Ryan Gravenberch", "position": "MID", "age": 23, "overall": 83, "potential": 87, "pace": 66, "shooting": 58, "passing": 78, "defense": 64, "physical": 76}, {"name": "Wataru Endo", "position": "MID", "age": 32, "overall": 77, "potential": 77, "pace": 56, "shooting": 50, "passing": 68, "defense": 74, "physical": 74}, {"name": "Alexander Isak", "position": "FWD", "age": 26, "overall": 86, "potential": 88, "pace": 78, "shooting": 86, "passing": 68, "defense": 38, "physical": 72}, {"name": "Hugo Ekitike", "position": "FWD", "age": 23, "overall": 81, "potential": 86, "pace": 78, "shooting": 72, "passing": 60, "defense": 32, "physical": 74}, {"name": "Cody Gakpo", "position": "FWD", "age": 26, "overall": 83, "potential": 84, "pace": 74, "shooting": 76, "passing": 74, "defense": 42, "physical": 72}, {"name": "Mohamed Salah", "position": "FWD", "age": 33, "overall": 88, "potential": 88, "pace": 82, "shooting": 88, "passing": 80, "defense": 42, "physical": 68}, {"name": "Giovanni Leoni", "position": "DEF", "age": 19, "overall": 72, "potential": 84, "pace": 68, "shooting": 40, "passing": 56, "defense": 72, "physical": 76}, {"name": "Freddie Woodman", "position": "GK", "age": 29, "overall": 68, "potential": 68, "pace": 54, "shooting": 40, "passing": 60, "defense": 40, "physical": 72}, {"name": "Trey Nyoni", "position": "MID", "age": 18, "overall": 66, "potential": 82, "pace": 68, "shooting": 52, "passing": 62, "defense": 48, "physical": 54}, {"name": "Rio Ngumoha", "position": "FWD", "age": 17, "overall": 66, "potential": 84, "pace": 84, "shooting": 58, "passing": 58, "defense": 28, "physical": 52}]}, "chelsea": {"name": "Chelsea FC", "players": [{"name": "Robert Sanchez", "position": "GK", "age": 27, "overall": 81, "potential": 82, "pace": 56, "shooting": 42, "passing": 66, "defense": 44, "physical": 80}, {"name": "Filip Jorgensen", "position": "GK", "age": 23, "overall": 77, "potential": 84, "pace": 56, "shooting": 42, "passing": 62, "defense": 42, "physical": 74}, {"name": "Marc Cucurella", "position": "DEF", "age": 27, "overall": 83, "potential": 84, "pace": 74, "shooting": 58, "passing": 78, "defense": 76, "physical": 68}, {"name": "Tosin Adarabioyo", "position": "DEF", "age": 27, "overall": 78, "potential": 78, "pace": 62, "shooting": 44, "passing": 62, "defense": 78, "physical": 80}, {"name": "Benoit Badiashile", "position": "DEF", "age": 24, "overall": 79, "potential": 84, "pace": 60, "shooting": 42, "passing": 62, "defense": 78, "physical": 74}, {"name": "Levi Colwill", "position": "DEF", "age": 22, "overall": 81, "potential": 88, "pace": 66, "shooting": 42, "passing": 66, "defense": 80, "physical": 74}, {"name": "Trevoh Chalobah", "position": "DEF", "age": 26, "overall": 78, "potential": 80, "pace": 62, "shooting": 46, "passing": 64, "defense": 76, "physical": 76}, {"name": "Reece James", "position": "DEF", "age": 25, "overall": 84, "potential": 88, "pace": 74, "shooting": 68, "passing": 80, "defense": 76, "physical": 72}, {"name": "Malo Gusto", "position": "DEF", "age": 22, "overall": 79, "potential": 84, "pace": 80, "shooting": 52, "passing": 70, "defense": 74, "physical": 68}, {"name": "Enzo Fernandez", "position": "MID", "age": 24, "overall": 86, "potential": 88, "pace": 62, "shooting": 70, "passing": 86, "defense": 72, "physical": 70}, {"name": "Moises Caicedo", "position": "MID", "age": 23, "overall": 86, "potential": 89, "pace": 74, "shooting": 54, "passing": 74, "defense": 84, "physical": 80}, {"name": "Romeo Lavia", "position": "MID", "age": 21, "overall": 79, "potential": 84, "pace": 64, "shooting": 46, "passing": 68, "defense": 78, "physical": 72}, {"name": "Joao Pedro", "position": "FWD", "age": 24, "overall": 82, "potential": 86, "pace": 72, "shooting": 78, "passing": 68, "defense": 38, "physical": 72}, {"name": "Cole Palmer", "position": "MID", "age": 23, "overall": 87, "potential": 91, "pace": 70, "shooting": 84, "passing": 82, "defense": 42, "physical": 62}, {"name": "Nicolas Jackson", "position": "FWD", "age": 24, "overall": 78, "potential": 82, "pace": 84, "shooting": 68, "passing": 58, "defense": 32, "physical": 68}, {"name": "Christopher Nkunku", "position": "FWD", "age": 27, "overall": 81, "potential": 83, "pace": 74, "shooting": 74, "passing": 74, "defense": 44, "physical": 64}, {"name": "Pedro Neto", "position": "FWD", "age": 25, "overall": 82, "potential": 85, "pace": 84, "shooting": 72, "passing": 72, "defense": 38, "physical": 64}, {"name": "Liam Delap", "position": "FWD", "age": 22, "overall": 77, "potential": 84, "pace": 70, "shooting": 72, "passing": 54, "defense": 32, "physical": 80}, {"name": "Wesley Fofana", "position": "DEF", "age": 25, "overall": 79, "potential": 80, "pace": 68, "shooting": 44, "passing": 60, "defense": 80, "physical": 78}, {"name": "Josh Acheampong", "position": "DEF", "age": 19, "overall": 68, "potential": 80, "pace": 68, "shooting": 42, "passing": 58, "defense": 66, "physical": 68}, {"name": "Mamadou Sarr", "position": "DEF", "age": 20, "overall": 68, "potential": 78, "pace": 66, "shooting": 38, "passing": 54, "defense": 68, "physical": 72}, {"name": "Marc Guiu", "position": "FWD", "age": 20, "overall": 68, "potential": 76, "pace": 70, "shooting": 64, "passing": 50, "defense": 28, "physical": 68}, {"name": "Estevao", "position": "FWD", "age": 19, "overall": 76, "potential": 88, "pace": 84, "shooting": 70, "passing": 72, "defense": 36, "physical": 54}, {"name": "Jamie Gittens", "position": "FWD", "age": 21, "overall": 76, "potential": 82, "pace": 88, "shooting": 68, "passing": 64, "defense": 34, "physical": 58}, {"name": "Andrey Santos", "position": "MID", "age": 21, "overall": 72, "potential": 80, "pace": 66, "shooting": 54, "passing": 66, "defense": 66, "physical": 66}, {"name": "Alejandro Garnacho", "position": "FWD", "age": 21, "overall": 77, "potential": 82, "pace": 86, "shooting": 70, "passing": 66, "defense": 38, "physical": 62}]}, "manchester_united": {"name": "Manchester United FC", "players": [{"name": "Senne Lammens", "position": "GK", "age": 23, "overall": 76, "potential": 84, "pace": 54, "shooting": 40, "passing": 62, "defense": 42, "physical": 74}, {"name": "Diogo Dalot", "position": "DEF", "age": 26, "overall": 80, "potential": 82, "pace": 74, "shooting": 54, "passing": 72, "defense": 74, "physical": 70}, {"name": "Luke Shaw", "position": "DEF", "age": 30, "overall": 79, "potential": 79, "pace": 66, "shooting": 50, "passing": 72, "defense": 76, "physical": 68}, {"name": "Harry Maguire", "position": "DEF", "age": 32, "overall": 78, "potential": 78, "pace": 52, "shooting": 44, "passing": 58, "defense": 78, "physical": 82}, {"name": "Leny Yoro", "position": "DEF", "age": 20, "overall": 80, "potential": 88, "pace": 68, "shooting": 40, "passing": 62, "defense": 80, "physical": 74}, {"name": "Lisandro Martinez", "position": "DEF", "age": 27, "overall": 82, "potential": 83, "pace": 62, "shooting": 46, "passing": 66, "defense": 82, "physical": 74}, {"name": "Noussair Mazraoui", "position": "DEF", "age": 27, "overall": 79, "potential": 80, "pace": 74, "shooting": 50, "passing": 68, "defense": 72, "physical": 70}, {"name": "Patrick Dorgu", "position": "DEF", "age": 20, "overall": 76, "potential": 84, "pace": 80, "shooting": 52, "passing": 64, "defense": 68, "physical": 66}, {"name": "Bruno Fernandes", "position": "MID", "age": 31, "overall": 88, "potential": 88, "pace": 66, "shooting": 82, "passing": 86, "defense": 60, "physical": 66}, {"name": "Casemiro", "position": "MID", "age": 33, "overall": 82, "potential": 82, "pace": 50, "shooting": 60, "passing": 72, "defense": 82, "physical": 80}, {"name": "Kobbie Mainoo", "position": "MID", "age": 20, "overall": 80, "potential": 86, "pace": 68, "shooting": 62, "passing": 78, "defense": 66, "physical": 64}, {"name": "Mason Mount", "position": "MID", "age": 26, "overall": 78, "potential": 78, "pace": 66, "shooting": 66, "passing": 74, "defense": 54, "physical": 62}, {"name": "Manuel Ugarte", "position": "MID", "age": 24, "overall": 79, "potential": 82, "pace": 64, "shooting": 42, "passing": 66, "defense": 80, "physical": 76}, {"name": "Bryan Mbeumo", "position": "FWD", "age": 25, "overall": 84, "potential": 86, "pace": 80, "shooting": 78, "passing": 70, "defense": 42, "physical": 68}, {"name": "Matheus Cunha", "position": "FWD", "age": 26, "overall": 82, "potential": 82, "pace": 74, "shooting": 74, "passing": 68, "defense": 40, "physical": 74}, {"name": "Amad Diallo", "position": "FWD", "age": 23, "overall": 79, "potential": 84, "pace": 78, "shooting": 68, "passing": 66, "defense": 38, "physical": 62}, {"name": "Benjamin Sesko", "position": "FWD", "age": 22, "overall": 81, "potential": 86, "pace": 74, "shooting": 76, "passing": 58, "defense": 34, "physical": 80}, {"name": "Joshua Zirkzee", "position": "FWD", "age": 24, "overall": 78, "potential": 80, "pace": 64, "shooting": 68, "passing": 64, "defense": 36, "physical": 76}, {"name": "Matthijs de Ligt", "position": "DEF", "age": 26, "overall": 80, "potential": 80, "pace": 58, "shooting": 44, "passing": 62, "defense": 80, "physical": 80}, {"name": "Ayden Heaven", "position": "DEF", "age": 19, "overall": 70, "potential": 80, "pace": 66, "shooting": 40, "passing": 54, "defense": 68, "physical": 74}, {"name": "Tyrell Malacia", "position": "DEF", "age": 26, "overall": 72, "potential": 74, "pace": 68, "shooting": 44, "passing": 60, "defense": 68, "physical": 70}, {"name": "Altay Bayindir", "position": "GK", "age": 28, "overall": 72, "potential": 74, "pace": 54, "shooting": 40, "passing": 62, "defense": 42, "physical": 74}, {"name": "Tom Heaton", "position": "GK", "age": 40, "overall": 64, "potential": 64, "pace": 42, "shooting": 36, "passing": 54, "defense": 38, "physical": 64}, {"name": "Chido Obi", "position": "FWD", "age": 18, "overall": 66, "potential": 80, "pace": 72, "shooting": 62, "passing": 48, "defense": 24, "physical": 64}]}, "tottenham_hotspur": {"name": "Tottenham Hotspur FC", "players": [{"name": "Guglielmo Vicario", "position": "GK", "age": 28, "overall": 84, "potential": 86, "pace": 60, "shooting": 44, "passing": 74, "defense": 50, "physical": 78}, {"name": "Fraser Forster", "position": "GK", "age": 37, "overall": 74, "potential": 74, "pace": 44, "shooting": 38, "passing": 58, "defense": 40, "physical": 80}, {"name": "Cristian Romero", "position": "DEF", "age": 27, "overall": 85, "potential": 86, "pace": 66, "shooting": 52, "passing": 64, "defense": 86, "physical": 82}, {"name": "Micky van de Ven", "position": "DEF", "age": 24, "overall": 83, "potential": 88, "pace": 90, "shooting": 50, "passing": 66, "defense": 80, "physical": 72}, {"name": "Destiny Udogie", "position": "DEF", "age": 22, "overall": 80, "potential": 86, "pace": 76, "shooting": 52, "passing": 70, "defense": 74, "physical": 68}, {"name": "Pedro Porro", "position": "DEF", "age": 26, "overall": 81, "potential": 83, "pace": 80, "shooting": 64, "passing": 76, "defense": 70, "physical": 70}, {"name": "Richarlison", "position": "FWD", "age": 28, "overall": 79, "potential": 79, "pace": 76, "shooting": 74, "passing": 62, "defense": 44, "physical": 76}, {"name": "Antonin Kinsky", "position": "GK", "age": 22, "overall": 73, "potential": 80, "pace": 58, "shooting": 42, "passing": 64, "defense": 44, "physical": 72}, {"name": "Kevin Danso", "position": "DEF", "age": 27, "overall": 76, "potential": 77, "pace": 66, "shooting": 44, "passing": 58, "defense": 76, "physical": 80}, {"name": "Ben Davies", "position": "DEF", "age": 32, "overall": 70, "potential": 70, "pace": 58, "shooting": 40, "passing": 60, "defense": 70, "physical": 72}, {"name": "Archie Gray", "position": "DEF", "age": 20, "overall": 74, "potential": 82, "pace": 68, "shooting": 52, "passing": 70, "defense": 66, "physical": 68}, {"name": "Djed Spence", "position": "DEF", "age": 25, "overall": 71, "potential": 74, "pace": 84, "shooting": 48, "passing": 60, "defense": 62, "physical": 68}, {"name": "James Maddison", "position": "MID", "age": 29, "overall": 83, "potential": 83, "pace": 66, "shooting": 76, "passing": 84, "defense": 50, "physical": 60}, {"name": "Pape Matar Sarr", "position": "MID", "age": 23, "overall": 77, "potential": 81, "pace": 74, "shooting": 58, "passing": 70, "defense": 70, "physical": 72}, {"name": "Rodrigo Bentancur", "position": "MID", "age": 28, "overall": 78, "potential": 78, "pace": 64, "shooting": 58, "passing": 72, "defense": 74, "physical": 74}, {"name": "Yves Bissouma", "position": "MID", "age": 29, "overall": 77, "potential": 77, "pace": 68, "shooting": 54, "passing": 68, "defense": 76, "physical": 76}, {"name": "Joao Palhinha", "position": "MID", "age": 30, "overall": 78, "potential": 78, "pace": 54, "shooting": 52, "passing": 66, "defense": 82, "physical": 80}, {"name": "Lucas Bergvall", "position": "MID", "age": 20, "overall": 76, "potential": 86, "pace": 72, "shooting": 60, "passing": 74, "defense": 62, "physical": 64}, {"name": "Xavi Simons", "position": "MID", "age": 22, "overall": 81, "potential": 87, "pace": 74, "shooting": 74, "passing": 80, "defense": 48, "physical": 58}, {"name": "Conor Gallagher", "position": "MID", "age": 25, "overall": 75, "potential": 76, "pace": 72, "shooting": 62, "passing": 68, "defense": 64, "physical": 72}, {"name": "Mohammed Kudus", "position": "MID", "age": 25, "overall": 80, "potential": 83, "pace": 80, "shooting": 74, "passing": 70, "defense": 44, "physical": 64}, {"name": "Dejan Kulusevski", "position": "MID", "age": 26, "overall": 81, "potential": 82, "pace": 74, "shooting": 74, "passing": 74, "defense": 48, "physical": 66}, {"name": "Mathys Tel", "position": "FWD", "age": 21, "overall": 74, "potential": 82, "pace": 80, "shooting": 68, "passing": 58, "defense": 32, "physical": 62}, {"name": "Dominic Solanke", "position": "FWD", "age": 28, "overall": 76, "potential": 76, "pace": 68, "shooting": 74, "passing": 58, "defense": 32, "physical": 74}, {"name": "Wilson Odobert", "position": "FWD", "age": 21, "overall": 71, "potential": 78, "pace": 84, "shooting": 62, "passing": 54, "defense": 30, "physical": 56}, {"name": "Mikey Moore", "position": "FWD", "age": 18, "overall": 68, "potential": 82, "pace": 84, "shooting": 58, "passing": 54, "defense": 26, "physical": 52}]}, "newcastle_united": {"name": "Newcastle United FC", "players": [{"name": "Nick Pope", "position": "GK", "age": 34, "overall": 82, "potential": 82, "pace": 58, "shooting": 44, "passing": 64, "defense": 54, "physical": 78}, {"name": "Aaron Ramsdale", "position": "GK", "age": 28, "overall": 78, "potential": 80, "pace": 58, "shooting": 42, "passing": 66, "defense": 50, "physical": 74}, {"name": "Kieran Trippier", "position": "DEF", "age": 36, "overall": 78, "potential": 78, "pace": 60, "shooting": 58, "passing": 80, "defense": 74, "physical": 66}, {"name": "Lewis Hall", "position": "DEF", "age": 21, "overall": 78, "potential": 84, "pace": 74, "shooting": 52, "passing": 74, "defense": 70, "physical": 66}, {"name": "Sven Botman", "position": "DEF", "age": 26, "overall": 81, "potential": 84, "pace": 62, "shooting": 40, "passing": 60, "defense": 82, "physical": 78}, {"name": "Fabian Schar", "position": "DEF", "age": 34, "overall": 79, "potential": 79, "pace": 52, "shooting": 46, "passing": 66, "defense": 78, "physical": 76}, {"name": "Malick Thiaw", "position": "DEF", "age": 25, "overall": 79, "potential": 82, "pace": 64, "shooting": 40, "passing": 58, "defense": 78, "physical": 78}, {"name": "Dan Burn", "position": "DEF", "age": 34, "overall": 77, "potential": 77, "pace": 48, "shooting": 36, "passing": 54, "defense": 76, "physical": 84}, {"name": "Valentino Livramento", "position": "DEF", "age": 23, "overall": 78, "potential": 83, "pace": 80, "shooting": 52, "passing": 68, "defense": 68, "physical": 66}, {"name": "Joelinton", "position": "MID", "age": 29, "overall": 80, "potential": 80, "pace": 72, "shooting": 66, "passing": 64, "defense": 72, "physical": 84}, {"name": "Sandro Tonali", "position": "MID", "age": 26, "overall": 83, "potential": 85, "pace": 62, "shooting": 64, "passing": 78, "defense": 74, "physical": 74}, {"name": "Bruno Guimaraes", "position": "MID", "age": 28, "overall": 85, "potential": 87, "pace": 66, "shooting": 68, "passing": 82, "defense": 74, "physical": 72}, {"name": "Jacob Ramsey", "position": "MID", "age": 24, "overall": 76, "potential": 80, "pace": 72, "shooting": 64, "passing": 70, "defense": 58, "physical": 66}, {"name": "Jacob Murphy", "position": "MID", "age": 31, "overall": 76, "potential": 76, "pace": 80, "shooting": 66, "passing": 66, "defense": 50, "physical": 66}, {"name": "Joe Willock", "position": "MID", "age": 26, "overall": 74, "potential": 74, "pace": 74, "shooting": 62, "passing": 64, "defense": 58, "physical": 68}, {"name": "Nick Woltemade", "position": "FWD", "age": 24, "overall": 79, "potential": 83, "pace": 66, "shooting": 74, "passing": 64, "defense": 42, "physical": 80}, {"name": "Yoane Wissa", "position": "FWD", "age": 29, "overall": 78, "potential": 78, "pace": 76, "shooting": 74, "passing": 58, "defense": 38, "physical": 72}, {"name": "Harvey Barnes", "position": "FWD", "age": 28, "overall": 78, "potential": 78, "pace": 80, "shooting": 72, "passing": 66, "defense": 36, "physical": 64}, {"name": "Anthony Elanga", "position": "FWD", "age": 23, "overall": 78, "potential": 82, "pace": 90, "shooting": 68, "passing": 60, "defense": 36, "physical": 64}, {"name": "Anthony Gordon", "position": "FWD", "age": 25, "overall": 80, "potential": 83, "pace": 86, "shooting": 72, "passing": 68, "defense": 42, "physical": 66}, {"name": "Emil Krafth", "position": "DEF", "age": 31, "overall": 68, "potential": 68, "pace": 68, "shooting": 42, "passing": 58, "defense": 66, "physical": 68}, {"name": "Will Osula", "position": "FWD", "age": 22, "overall": 70, "potential": 78, "pace": 74, "shooting": 66, "passing": 52, "defense": 30, "physical": 72}, {"name": "John Ruddy", "position": "GK", "age": 39, "overall": 62, "potential": 62, "pace": 42, "shooting": 36, "passing": 54, "defense": 36, "physical": 66}]}, "aston_villa": {"name": "Aston Villa FC", "players": [{"name": "Emiliano Martinez", "position": "GK", "age": 33, "overall": 84, "potential": 84, "pace": 58, "shooting": 46, "passing": 72, "defense": 54, "physical": 78}, {"name": "Matty Cash", "position": "DEF", "age": 28, "overall": 77, "potential": 77, "pace": 74, "shooting": 52, "passing": 64, "defense": 68, "physical": 74}, {"name": "Victor Lindelof", "position": "DEF", "age": 31, "overall": 76, "potential": 76, "pace": 54, "shooting": 40, "passing": 62, "defense": 76, "physical": 72}, {"name": "Ezri Konsa", "position": "DEF", "age": 28, "overall": 79, "potential": 79, "pace": 60, "shooting": 42, "passing": 62, "defense": 78, "physical": 76}, {"name": "Tyrone Mings", "position": "DEF", "age": 32, "overall": 74, "potential": 74, "pace": 52, "shooting": 36, "passing": 54, "defense": 76, "physical": 80}, {"name": "Lucas Digne", "position": "DEF", "age": 32, "overall": 78, "potential": 78, "pace": 68, "shooting": 54, "passing": 76, "defense": 70, "physical": 68}, {"name": "Pau Torres", "position": "DEF", "age": 28, "overall": 80, "potential": 80, "pace": 58, "shooting": 44, "passing": 68, "defense": 78, "physical": 74}, {"name": "Ian Maatsen", "position": "DEF", "age": 23, "overall": 77, "potential": 82, "pace": 78, "shooting": 54, "passing": 68, "defense": 68, "physical": 64}, {"name": "Ross Barkley", "position": "MID", "age": 32, "overall": 74, "potential": 74, "pace": 58, "shooting": 60, "passing": 72, "defense": 54, "physical": 66}, {"name": "John McGinn", "position": "MID", "age": 31, "overall": 80, "potential": 80, "pace": 74, "shooting": 68, "passing": 72, "defense": 66, "physical": 76}, {"name": "Youri Tielemans", "position": "MID", "age": 28, "overall": 79, "potential": 79, "pace": 62, "shooting": 68, "passing": 78, "defense": 62, "physical": 68}, {"name": "Boubacar Kamara", "position": "MID", "age": 26, "overall": 79, "potential": 79, "pace": 62, "shooting": 52, "passing": 70, "defense": 78, "physical": 78}, {"name": "Morgan Rogers", "position": "MID", "age": 23, "overall": 81, "potential": 86, "pace": 78, "shooting": 72, "passing": 74, "defense": 50, "physical": 68}, {"name": "Emiliano Buendia", "position": "MID", "age": 29, "overall": 76, "potential": 76, "pace": 68, "shooting": 64, "passing": 74, "defense": 44, "physical": 58}, {"name": "Amadou Onana", "position": "MID", "age": 24, "overall": 80, "potential": 84, "pace": 68, "shooting": 58, "passing": 68, "defense": 76, "physical": 80}, {"name": "Ollie Watkins", "position": "FWD", "age": 30, "overall": 84, "potential": 84, "pace": 82, "shooting": 84, "passing": 68, "defense": 40, "physical": 74}, {"name": "Tammy Abraham", "position": "FWD", "age": 28, "overall": 74, "potential": 74, "pace": 68, "shooting": 70, "passing": 54, "defense": 32, "physical": 72}, {"name": "Jadon Sancho", "position": "FWD", "age": 26, "overall": 76, "potential": 78, "pace": 80, "shooting": 68, "passing": 66, "defense": 38, "physical": 62}, {"name": "Leon Bailey", "position": "FWD", "age": 28, "overall": 79, "potential": 79, "pace": 84, "shooting": 72, "passing": 68, "defense": 38, "physical": 64}, {"name": "Douglas Luiz", "position": "MID", "age": 28, "overall": 76, "potential": 76, "pace": 64, "shooting": 58, "passing": 74, "defense": 68, "physical": 70}, {"name": "Harvey Elliott", "position": "MID", "age": 23, "overall": 76, "potential": 79, "pace": 74, "shooting": 64, "passing": 74, "defense": 50, "physical": 58}, {"name": "Andres Garcia", "position": "DEF", "age": 21, "overall": 68, "potential": 76, "pace": 80, "shooting": 44, "passing": 58, "defense": 58, "physical": 60}, {"name": "Marco Bizot", "position": "GK", "age": 34, "overall": 68, "potential": 68, "pace": 52, "shooting": 38, "passing": 60, "defense": 40, "physical": 74}, {"name": "Lamare Bogarde", "position": "MID", "age": 20, "overall": 68, "potential": 76, "pace": 66, "shooting": 48, "passing": 58, "defense": 68, "physical": 74}]}, "brighton_hove_albion": {"name": "Brighton & Hove Albion FC", "players": [{"name": "Bart Verbruggen", "position": "GK", "age": 23, "overall": 79, "potential": 84, "pace": 60, "shooting": 44, "passing": 68, "defense": 50, "physical": 74}, {"name": "Igor Julio", "position": "DEF", "age": 27, "overall": 74, "potential": 74, "pace": 68, "shooting": 40, "passing": 54, "defense": 72, "physical": 74}, {"name": "Adam Webster", "position": "DEF", "age": 31, "overall": 72, "potential": 72, "pace": 56, "shooting": 38, "passing": 54, "defense": 72, "physical": 76}, {"name": "Lewis Dunk", "position": "DEF", "age": 34, "overall": 76, "potential": 76, "pace": 52, "shooting": 42, "passing": 64, "defense": 76, "physical": 78}, {"name": "Jan Paul van Hecke", "position": "DEF", "age": 25, "overall": 76, "potential": 80, "pace": 64, "shooting": 40, "passing": 60, "defense": 74, "physical": 72}, {"name": "Ferdi Kadioglu", "position": "DEF", "age": 26, "overall": 78, "potential": 80, "pace": 80, "shooting": 58, "passing": 70, "defense": 68, "physical": 68}, {"name": "Olivier Boscagli", "position": "DEF", "age": 26, "overall": 74, "potential": 74, "pace": 60, "shooting": 38, "passing": 56, "defense": 70, "physical": 72}, {"name": "Maxim De Cuyper", "position": "DEF", "age": 24, "overall": 73, "potential": 76, "pace": 72, "shooting": 48, "passing": 64, "defense": 66, "physical": 66}, {"name": "Joel Veltman", "position": "DEF", "age": 33, "overall": 73, "potential": 73, "pace": 56, "shooting": 36, "passing": 58, "defense": 72, "physical": 70}, {"name": "Solly March", "position": "MID", "age": 31, "overall": 75, "potential": 75, "pace": 74, "shooting": 64, "passing": 68, "defense": 50, "physical": 58}, {"name": "Jack Hinshelwood", "position": "MID", "age": 20, "overall": 73, "potential": 80, "pace": 70, "shooting": 54, "passing": 66, "defense": 58, "physical": 62}, {"name": "Carlos Baleba", "position": "MID", "age": 21, "overall": 80, "potential": 87, "pace": 78, "shooting": 60, "passing": 70, "defense": 74, "physical": 78}, {"name": "James Milner", "position": "MID", "age": 39, "overall": 68, "potential": 68, "pace": 44, "shooting": 50, "passing": 68, "defense": 58, "physical": 64}, {"name": "Kaoru Mitoma", "position": "MID", "age": 28, "overall": 82, "potential": 84, "pace": 88, "shooting": 74, "passing": 70, "defense": 42, "physical": 60}, {"name": "Yasin Ayari", "position": "MID", "age": 22, "overall": 73, "potential": 79, "pace": 66, "shooting": 52, "passing": 66, "defense": 60, "physical": 64}, {"name": "Mats Wieffer", "position": "MID", "age": 25, "overall": 77, "potential": 81, "pace": 64, "shooting": 54, "passing": 72, "defense": 74, "physical": 72}, {"name": "Pascal Gross", "position": "MID", "age": 34, "overall": 77, "potential": 77, "pace": 58, "shooting": 64, "passing": 78, "defense": 58, "physical": 58}, {"name": "Matt O'Riley", "position": "MID", "age": 25, "overall": 77, "potential": 80, "pace": 66, "shooting": 66, "passing": 74, "defense": 58, "physical": 62}, {"name": "Diego Gomez", "position": "MID", "age": 22, "overall": 73, "potential": 78, "pace": 70, "shooting": 58, "passing": 68, "defense": 52, "physical": 58}, {"name": "Stefanos Tzimas", "position": "FWD", "age": 19, "overall": 71, "potential": 80, "pace": 72, "shooting": 68, "passing": 58, "defense": 32, "physical": 66}, {"name": "Georginio Rutter", "position": "FWD", "age": 23, "overall": 78, "potential": 83, "pace": 78, "shooting": 72, "passing": 68, "defense": 42, "physical": 66}, {"name": "Yankuba Minteh", "position": "MID", "age": 21, "overall": 76, "potential": 82, "pace": 88, "shooting": 66, "passing": 60, "defense": 38, "physical": 58}, {"name": "Danny Welbeck", "position": "FWD", "age": 35, "overall": 75, "potential": 75, "pace": 66, "shooting": 72, "passing": 62, "defense": 38, "physical": 68}, {"name": "Charalampos Kostoulas", "position": "FWD", "age": 18, "overall": 70, "potential": 82, "pace": 76, "shooting": 66, "passing": 54, "defense": 28, "physical": 62}, {"name": "Jason Steele", "position": "GK", "age": 35, "overall": 68, "potential": 68, "pace": 50, "shooting": 38, "passing": 58, "defense": 40, "physical": 70}, {"name": "Luka Vuskovic", "position": "DEF", "age": 19, "overall": 70, "potential": 84, "pace": 64, "shooting": 42, "passing": 54, "defense": 72, "physical": 78}, {"name": "Costinha", "position": "DEF", "age": 23, "overall": 72, "potential": 78, "pace": 74, "shooting": 44, "passing": 60, "defense": 68, "physical": 70}, {"name": "Eiran Cashin", "position": "DEF", "age": 24, "overall": 70, "potential": 76, "pace": 62, "shooting": 38, "passing": 52, "defense": 70, "physical": 76}, {"name": "Facundo Buonanotte", "position": "MID", "age": 21, "overall": 72, "potential": 80, "pace": 72, "shooting": 62, "passing": 72, "defense": 44, "physical": 54}]}, "afc_bournemouth": {"name": "AFC Bournemouth", "players": [{"name": "Djordje Petrovic", "position": "GK", "age": 26, "overall": 79, "potential": 82, "pace": 58, "shooting": 42, "passing": 64, "defense": 48, "physical": 76}, {"name": "Adrien Truffert", "position": "DEF", "age": 24, "overall": 75, "potential": 78, "pace": 76, "shooting": 54, "passing": 70, "defense": 68, "physical": 64}, {"name": "Bafode Diakite", "position": "DEF", "age": 24, "overall": 76, "potential": 80, "pace": 72, "shooting": 42, "passing": 58, "defense": 74, "physical": 76}, {"name": "Alex Jimenez", "position": "DEF", "age": 21, "overall": 75, "potential": 81, "pace": 80, "shooting": 52, "passing": 66, "defense": 68, "physical": 64}, {"name": "Marcos Senesi", "position": "DEF", "age": 28, "overall": 78, "potential": 78, "pace": 60, "shooting": 42, "passing": 58, "defense": 78, "physical": 78}, {"name": "James Hill", "position": "DEF", "age": 23, "overall": 74, "potential": 78, "pace": 64, "shooting": 38, "passing": 52, "defense": 72, "physical": 74}, {"name": "Julio Soler", "position": "DEF", "age": 20, "overall": 73, "potential": 80, "pace": 78, "shooting": 44, "passing": 58, "defense": 66, "physical": 66}, {"name": "Adam Smith", "position": "DEF", "age": 34, "overall": 68, "potential": 68, "pace": 62, "shooting": 40, "passing": 58, "defense": 64, "physical": 68}, {"name": "Ryan Christie", "position": "MID", "age": 30, "overall": 75, "potential": 75, "pace": 68, "shooting": 64, "passing": 72, "defense": 58, "physical": 62}, {"name": "Tyler Adams", "position": "MID", "age": 26, "overall": 76, "potential": 76, "pace": 72, "shooting": 48, "passing": 64, "defense": 74, "physical": 76}, {"name": "Marcus Tavernier", "position": "MID", "age": 26, "overall": 77, "potential": 77, "pace": 74, "shooting": 68, "passing": 68, "defense": 52, "physical": 64}, {"name": "David Brooks", "position": "MID", "age": 28, "overall": 73, "potential": 73, "pace": 70, "shooting": 62, "passing": 66, "defense": 44, "physical": 58}, {"name": "Alex Scott", "position": "MID", "age": 22, "overall": 75, "potential": 80, "pace": 74, "shooting": 58, "passing": 68, "defense": 62, "physical": 66}, {"name": "Lewis Cook", "position": "MID", "age": 28, "overall": 75, "potential": 75, "pace": 64, "shooting": 58, "passing": 72, "defense": 66, "physical": 64}, {"name": "Ben Doak", "position": "FWD", "age": 20, "overall": 74, "potential": 82, "pace": 86, "shooting": 64, "passing": 58, "defense": 34, "physical": 58}, {"name": "Amine Adli", "position": "FWD", "age": 25, "overall": 75, "potential": 77, "pace": 78, "shooting": 66, "passing": 64, "defense": 38, "physical": 62}, {"name": "Evanilson", "position": "FWD", "age": 26, "overall": 79, "potential": 80, "pace": 72, "shooting": 76, "passing": 58, "defense": 36, "physical": 74}, {"name": "Enes Unal", "position": "FWD", "age": 28, "overall": 74, "potential": 74, "pace": 64, "shooting": 72, "passing": 52, "defense": 32, "physical": 74}, {"name": "Eli Junior Kroupi", "position": "FWD", "age": 20, "overall": 76, "potential": 84, "pace": 80, "shooting": 74, "passing": 58, "defense": 32, "physical": 66}, {"name": "Justin Kluivert", "position": "FWD", "age": 26, "overall": 78, "potential": 79, "pace": 84, "shooting": 72, "passing": 66, "defense": 38, "physical": 62}, {"name": "Antoine Semenyo", "position": "FWD", "age": 25, "overall": 79, "potential": 80, "pace": 82, "shooting": 74, "passing": 64, "defense": 42, "physical": 78}]}, "brentford": {"name": "Brentford FC", "players": [{"name": "Caoimhin Kelleher", "position": "GK", "age": 27, "overall": 77, "potential": 79, "pace": 58, "shooting": 42, "passing": 64, "defense": 46, "physical": 74}, {"name": "Rico Henry", "position": "DEF", "age": 28, "overall": 74, "potential": 74, "pace": 76, "shooting": 50, "passing": 62, "defense": 72, "physical": 68}, {"name": "Sepp van den Berg", "position": "DEF", "age": 23, "overall": 76, "potential": 80, "pace": 68, "shooting": 42, "passing": 58, "defense": 76, "physical": 76}, {"name": "Ethan Pinnock", "position": "DEF", "age": 32, "overall": 74, "potential": 74, "pace": 54, "shooting": 38, "passing": 54, "defense": 74, "physical": 78}, {"name": "Nathan Collins", "position": "DEF", "age": 24, "overall": 79, "potential": 82, "pace": 62, "shooting": 44, "passing": 58, "defense": 80, "physical": 80}, {"name": "Aaron Hickey", "position": "DEF", "age": 23, "overall": 75, "potential": 79, "pace": 76, "shooting": 52, "passing": 66, "defense": 70, "physical": 70}, {"name": "Kristoffer Ajer", "position": "DEF", "age": 27, "overall": 74, "potential": 74, "pace": 60, "shooting": 38, "passing": 58, "defense": 74, "physical": 76}, {"name": "Michael Kayode", "position": "DEF", "age": 21, "overall": 72, "potential": 78, "pace": 78, "shooting": 46, "passing": 58, "defense": 66, "physical": 68}, {"name": "Jordan Henderson", "position": "MID", "age": 35, "overall": 73, "potential": 73, "pace": 54, "shooting": 54, "passing": 72, "defense": 62, "physical": 66}, {"name": "Mathias Jensen", "position": "MID", "age": 29, "overall": 76, "potential": 76, "pace": 66, "shooting": 60, "passing": 72, "defense": 58, "physical": 60}, {"name": "Vitaly Janelt", "position": "MID", "age": 27, "overall": 75, "potential": 75, "pace": 64, "shooting": 56, "passing": 68, "defense": 66, "physical": 72}, {"name": "Yehor Yarmoliuk", "position": "MID", "age": 21, "overall": 72, "potential": 78, "pace": 68, "shooting": 50, "passing": 62, "defense": 64, "physical": 68}, {"name": "Frank Onyeka", "position": "MID", "age": 27, "overall": 73, "potential": 73, "pace": 72, "shooting": 52, "passing": 62, "defense": 66, "physical": 74}, {"name": "Mikkel Damsgaard", "position": "MID", "age": 25, "overall": 77, "potential": 78, "pace": 68, "shooting": 68, "passing": 74, "defense": 44, "physical": 56}, {"name": "Antoni Milambo", "position": "MID", "age": 21, "overall": 73, "potential": 80, "pace": 70, "shooting": 58, "passing": 68, "defense": 58, "physical": 60}, {"name": "Fabio Carvalho", "position": "MID", "age": 23, "overall": 75, "potential": 79, "pace": 74, "shooting": 64, "passing": 68, "defense": 44, "physical": 56}, {"name": "Kevin Schade", "position": "FWD", "age": 24, "overall": 78, "potential": 81, "pace": 88, "shooting": 70, "passing": 62, "defense": 36, "physical": 66}, {"name": "Igor Thiago", "position": "FWD", "age": 24, "overall": 81, "potential": 84, "pace": 76, "shooting": 82, "passing": 58, "defense": 34, "physical": 76}, {"name": "Dango Ouattara", "position": "FWD", "age": 23, "overall": 77, "potential": 80, "pace": 88, "shooting": 68, "passing": 60, "defense": 38, "physical": 68}, {"name": "Keane Lewis-Potter", "position": "FWD", "age": 24, "overall": 74, "potential": 76, "pace": 78, "shooting": 64, "passing": 60, "defense": 40, "physical": 62}]}, "crystal_palace": {"name": "Crystal Palace FC", "players": [{"name": "Dean Henderson", "position": "GK", "age": 29, "overall": 81, "potential": 81, "pace": 60, "shooting": 44, "passing": 68, "defense": 52, "physical": 78}, {"name": "Walter Benitez", "position": "GK", "age": 32, "overall": 76, "potential": 76, "pace": 60, "shooting": 42, "passing": 66, "defense": 48, "physical": 74}, {"name": "Daniel Munoz", "position": "DEF", "age": 29, "overall": 78, "potential": 78, "pace": 80, "shooting": 58, "passing": 68, "defense": 70, "physical": 74}, {"name": "Tyrick Mitchell", "position": "DEF", "age": 26, "overall": 76, "potential": 76, "pace": 72, "shooting": 50, "passing": 66, "defense": 70, "physical": 70}, {"name": "Maxence Lacroix", "position": "DEF", "age": 25, "overall": 78, "potential": 80, "pace": 68, "shooting": 42, "passing": 58, "defense": 78, "physical": 78}, {"name": "Chris Richards", "position": "DEF", "age": 25, "overall": 75, "potential": 77, "pace": 66, "shooting": 40, "passing": 56, "defense": 74, "physical": 78}, {"name": "Nathaniel Clyne", "position": "DEF", "age": 34, "overall": 68, "potential": 68, "pace": 62, "shooting": 38, "passing": 58, "defense": 66, "physical": 66}, {"name": "Jaydee Canvot", "position": "DEF", "age": 19, "overall": 71, "potential": 80, "pace": 68, "shooting": 38, "passing": 54, "defense": 68, "physical": 72}, {"name": "Borna Sosa", "position": "DEF", "age": 27, "overall": 72, "potential": 72, "pace": 64, "shooting": 50, "passing": 68, "defense": 62, "physical": 58}, {"name": "Chadi Riad", "position": "DEF", "age": 22, "overall": 72, "potential": 77, "pace": 62, "shooting": 38, "passing": 56, "defense": 70, "physical": 72}, {"name": "Adam Wharton", "position": "MID", "age": 21, "overall": 80, "potential": 86, "pace": 68, "shooting": 58, "passing": 80, "defense": 68, "physical": 64}, {"name": "Jefferson Lerma", "position": "MID", "age": 30, "overall": 76, "potential": 76, "pace": 64, "shooting": 54, "passing": 66, "defense": 74, "physical": 78}, {"name": "Will Hughes", "position": "MID", "age": 29, "overall": 72, "potential": 72, "pace": 62, "shooting": 54, "passing": 68, "defense": 60, "physical": 62}, {"name": "Cheick Doucoure", "position": "MID", "age": 25, "overall": 76, "potential": 76, "pace": 68, "shooting": 50, "passing": 64, "defense": 76, "physical": 78}, {"name": "Daichi Kamada", "position": "MID", "age": 29, "overall": 75, "potential": 75, "pace": 70, "shooting": 64, "passing": 72, "defense": 54, "physical": 62}, {"name": "Justin Devenny", "position": "MID", "age": 22, "overall": 68, "potential": 72, "pace": 68, "shooting": 52, "passing": 60, "defense": 54, "physical": 60}, {"name": "Jean-Philippe Mateta", "position": "FWD", "age": 28, "overall": 77, "potential": 77, "pace": 68, "shooting": 74, "passing": 54, "defense": 32, "physical": 80}, {"name": "Ismaila Sarr", "position": "FWD", "age": 27, "overall": 80, "potential": 80, "pace": 91, "shooting": 74, "passing": 66, "defense": 38, "physical": 72}, {"name": "Eddie Nketiah", "position": "FWD", "age": 26, "overall": 73, "potential": 73, "pace": 66, "shooting": 68, "passing": 52, "defense": 30, "physical": 68}, {"name": "Brennan Johnson", "position": "FWD", "age": 24, "overall": 76, "potential": 79, "pace": 84, "shooting": 68, "passing": 62, "defense": 36, "physical": 60}, {"name": "Yeremy Pino", "position": "MID", "age": 23, "overall": 75, "potential": 79, "pace": 80, "shooting": 66, "passing": 66, "defense": 42, "physical": 58}, {"name": "Christantus Uche", "position": "MID", "age": 22, "overall": 71, "potential": 77, "pace": 76, "shooting": 58, "passing": 60, "defense": 44, "physical": 60}, {"name": "Jorgen Strand Larsen", "position": "FWD", "age": 25, "overall": 75, "potential": 77, "pace": 68, "shooting": 72, "passing": 54, "defense": 32, "physical": 78}, {"name": "Evann Guessand", "position": "FWD", "age": 24, "overall": 73, "potential": 76, "pace": 78, "shooting": 68, "passing": 58, "defense": 36, "physical": 70}]}, "everton": {"name": "Everton FC", "players": [{"name": "Jordan Pickford", "position": "GK", "age": 31, "overall": 84, "potential": 84, "pace": 68, "shooting": 46, "passing": 72, "defense": 58, "physical": 76}, {"name": "Mark Travers", "position": "GK", "age": 26, "overall": 72, "potential": 74, "pace": 64, "shooting": 42, "passing": 62, "defense": 48, "physical": 70}, {"name": "Michael Keane", "position": "DEF", "age": 32, "overall": 72, "potential": 72, "pace": 52, "shooting": 38, "passing": 54, "defense": 74, "physical": 78}, {"name": "James Tarkowski", "position": "DEF", "age": 32, "overall": 75, "potential": 75, "pace": 52, "shooting": 42, "passing": 56, "defense": 78, "physical": 80}, {"name": "Jarrad Branthwaite", "position": "DEF", "age": 23, "overall": 79, "potential": 84, "pace": 66, "shooting": 40, "passing": 60, "defense": 80, "physical": 80}, {"name": "Adam Aznou", "position": "DEF", "age": 19, "overall": 68, "potential": 78, "pace": 74, "shooting": 44, "passing": 58, "defense": 62, "physical": 60}, {"name": "Idrissa Gueye", "position": "MID", "age": 35, "overall": 72, "potential": 72, "pace": 66, "shooting": 50, "passing": 64, "defense": 72, "physical": 74}, {"name": "Jack Grealish", "position": "MID", "age": 29, "overall": 80, "potential": 80, "pace": 72, "shooting": 68, "passing": 78, "defense": 48, "physical": 66}, {"name": "James Garner", "position": "MID", "age": 24, "overall": 73, "potential": 76, "pace": 64, "shooting": 58, "passing": 68, "defense": 64, "physical": 66}, {"name": "Kiernan Dewsbury-Hall", "position": "MID", "age": 26, "overall": 75, "potential": 76, "pace": 68, "shooting": 62, "passing": 70, "defense": 58, "physical": 64}, {"name": "Carlos Alcaraz", "position": "MID", "age": 22, "overall": 73, "potential": 78, "pace": 72, "shooting": 60, "passing": 66, "defense": 52, "physical": 58}, {"name": "Dwight McNeil", "position": "MID", "age": 25, "overall": 76, "potential": 77, "pace": 76, "shooting": 66, "passing": 68, "defense": 44, "physical": 60}, {"name": "Beto", "position": "FWD", "age": 26, "overall": 72, "potential": 73, "pace": 68, "shooting": 68, "passing": 50, "defense": 32, "physical": 78}, {"name": "Iliman Ndiaye", "position": "FWD", "age": 24, "overall": 75, "potential": 79, "pace": 80, "shooting": 68, "passing": 66, "defense": 38, "physical": 58}, {"name": "Thierno Barry", "position": "FWD", "age": 22, "overall": 72, "potential": 78, "pace": 74, "shooting": 68, "passing": 52, "defense": 32, "physical": 74}, {"name": "Tom King", "position": "GK", "age": 30, "overall": 64, "potential": 64, "pace": 58, "shooting": 40, "passing": 56, "defense": 38, "physical": 66}, {"name": "Jake O'Brien", "position": "DEF", "age": 24, "overall": 72, "potential": 78, "pace": 66, "shooting": 42, "passing": 56, "defense": 72, "physical": 80}, {"name": "Seamus Coleman", "position": "DEF", "age": 37, "overall": 64, "potential": 64, "pace": 54, "shooting": 40, "passing": 58, "defense": 64, "physical": 68}, {"name": "Vitaliy Mykolenko", "position": "DEF", "age": 26, "overall": 74, "potential": 76, "pace": 72, "shooting": 48, "passing": 66, "defense": 70, "physical": 68}, {"name": "Nathan Patterson", "position": "DEF", "age": 24, "overall": 71, "potential": 75, "pace": 76, "shooting": 46, "passing": 60, "defense": 66, "physical": 66}, {"name": "Elijah Campbell", "position": "DEF", "age": 21, "overall": 63, "potential": 72, "pace": 58, "shooting": 36, "passing": 48, "defense": 62, "physical": 72}, {"name": "Tim Iroegbunam", "position": "MID", "age": 22, "overall": 73, "potential": 79, "pace": 72, "shooting": 58, "passing": 64, "defense": 66, "physical": 72}, {"name": "Merlin Rohl", "position": "MID", "age": 23, "overall": 68, "potential": 74, "pace": 64, "shooting": 48, "passing": 62, "defense": 58, "physical": 62}, {"name": "Youssef Chermiti", "position": "FWD", "age": 22, "overall": 73, "potential": 80, "pace": 72, "shooting": 68, "passing": 54, "defense": 32, "physical": 76}]}, "fulham": {"name": "Fulham FC", "players": [{"name": "Bernd Leno", "position": "GK", "age": 33, "overall": 80, "potential": 80, "pace": 58, "shooting": 44, "passing": 70, "defense": 54, "physical": 74}, {"name": "Benjamin Lecomte", "position": "GK", "age": 34, "overall": 71, "potential": 71, "pace": 56, "shooting": 40, "passing": 60, "defense": 44, "physical": 68}, {"name": "Kenny Tete", "position": "DEF", "age": 30, "overall": 75, "potential": 75, "pace": 76, "shooting": 50, "passing": 64, "defense": 68, "physical": 72}, {"name": "Calvin Bassey", "position": "DEF", "age": 25, "overall": 74, "potential": 77, "pace": 72, "shooting": 42, "passing": 58, "defense": 70, "physical": 72}, {"name": "Joachim Andersen", "position": "DEF", "age": 29, "overall": 78, "potential": 78, "pace": 54, "shooting": 42, "passing": 62, "defense": 78, "physical": 78}, {"name": "Jorge Cuenca", "position": "DEF", "age": 26, "overall": 70, "potential": 72, "pace": 60, "shooting": 38, "passing": 54, "defense": 68, "physical": 72}, {"name": "Timothy Castagne", "position": "DEF", "age": 29, "overall": 75, "potential": 75, "pace": 74, "shooting": 52, "passing": 64, "defense": 70, "physical": 74}, {"name": "Ryan Sessegnon", "position": "DEF", "age": 25, "overall": 71, "potential": 74, "pace": 78, "shooting": 52, "passing": 60, "defense": 62, "physical": 66}, {"name": "Issa Diop", "position": "DEF", "age": 28, "overall": 70, "potential": 70, "pace": 56, "shooting": 36, "passing": 48, "defense": 68, "physical": 78}, {"name": "Antonee Robinson", "position": "DEF", "age": 28, "overall": 77, "potential": 77, "pace": 84, "shooting": 54, "passing": 68, "defense": 70, "physical": 70}, {"name": "Harrison Reed", "position": "MID", "age": 30, "overall": 71, "potential": 71, "pace": 60, "shooting": 50, "passing": 64, "defense": 68, "physical": 66}, {"name": "Tom Cairney", "position": "MID", "age": 34, "overall": 72, "potential": 72, "pace": 54, "shooting": 56, "passing": 74, "defense": 60, "physical": 62}, {"name": "Sander Berge", "position": "MID", "age": 27, "overall": 75, "potential": 75, "pace": 66, "shooting": 58, "passing": 66, "defense": 70, "physical": 80}, {"name": "Sasa Lukic", "position": "MID", "age": 29, "overall": 74, "potential": 74, "pace": 66, "shooting": 56, "passing": 66, "defense": 68, "physical": 72}, {"name": "Andreas Pereira", "position": "MID", "age": 29, "overall": 74, "potential": 74, "pace": 68, "shooting": 64, "passing": 70, "defense": 54, "physical": 64}, {"name": "Emile Smith Rowe", "position": "MID", "age": 25, "overall": 74, "potential": 77, "pace": 72, "shooting": 64, "passing": 70, "defense": 46, "physical": 58}, {"name": "Alex Iwobi", "position": "MID", "age": 29, "overall": 76, "potential": 76, "pace": 74, "shooting": 64, "passing": 70, "defense": 50, "physical": 62}, {"name": "Rodrigo Muniz", "position": "FWD", "age": 24, "overall": 73, "potential": 76, "pace": 74, "shooting": 70, "passing": 52, "defense": 32, "physical": 74}, {"name": "Raul Jimenez", "position": "FWD", "age": 34, "overall": 73, "potential": 73, "pace": 62, "shooting": 72, "passing": 58, "defense": 34, "physical": 78}, {"name": "Harry Wilson", "position": "MID", "age": 28, "overall": 74, "potential": 74, "pace": 68, "shooting": 68, "passing": 68, "defense": 46, "physical": 60}, {"name": "Samuel Chukwueze", "position": "MID", "age": 26, "overall": 75, "potential": 77, "pace": 84, "shooting": 68, "passing": 64, "defense": 38, "physical": 60}, {"name": "Josh King", "position": "FWD", "age": 33, "overall": 66, "potential": 66, "pace": 64, "shooting": 64, "passing": 54, "defense": 32, "physical": 66}]}, "leeds_united": {"name": "Leeds United FC", "players": [{"name": "Lucas Perri", "position": "GK", "age": 28, "overall": 77, "potential": 79, "pace": 66, "shooting": 44, "passing": 66, "defense": 50, "physical": 74}, {"name": "Illan Meslier", "position": "GK", "age": 26, "overall": 74, "potential": 76, "pace": 62, "shooting": 42, "passing": 62, "defense": 46, "physical": 70}, {"name": "Karl Darlow", "position": "GK", "age": 35, "overall": 68, "potential": 68, "pace": 54, "shooting": 40, "passing": 58, "defense": 44, "physical": 66}, {"name": "Jayden Bogle", "position": "DEF", "age": 25, "overall": 74, "potential": 76, "pace": 80, "shooting": 52, "passing": 66, "defense": 68, "physical": 70}, {"name": "Gabriel Gudmundsson", "position": "DEF", "age": 26, "overall": 72, "potential": 74, "pace": 70, "shooting": 50, "passing": 66, "defense": 64, "physical": 64}, {"name": "Pascal Struijk", "position": "DEF", "age": 26, "overall": 75, "potential": 77, "pace": 58, "shooting": 42, "passing": 60, "defense": 76, "physical": 80}, {"name": "Joe Rodon", "position": "DEF", "age": 28, "overall": 73, "potential": 73, "pace": 54, "shooting": 38, "passing": 52, "defense": 74, "physical": 78}, {"name": "James Justin", "position": "DEF", "age": 28, "overall": 73, "potential": 73, "pace": 74, "shooting": 50, "passing": 62, "defense": 68, "physical": 70}, {"name": "Sam Byram", "position": "DEF", "age": 32, "overall": 66, "potential": 66, "pace": 66, "shooting": 42, "passing": 58, "defense": 62, "physical": 64}, {"name": "Sebastiaan Bornauw", "position": "DEF", "age": 26, "overall": 70, "potential": 72, "pace": 58, "shooting": 38, "passing": 52, "defense": 68, "physical": 76}, {"name": "Jaka Bijol", "position": "DEF", "age": 25, "overall": 74, "potential": 77, "pace": 62, "shooting": 40, "passing": 52, "defense": 74, "physical": 80}, {"name": "Ethan Ampadu", "position": "MID", "age": 25, "overall": 76, "potential": 77, "pace": 62, "shooting": 44, "passing": 68, "defense": 76, "physical": 74}, {"name": "Daniel James", "position": "MID", "age": 27, "overall": 71, "potential": 71, "pace": 88, "shooting": 60, "passing": 58, "defense": 38, "physical": 58}, {"name": "Sean Longstaff", "position": "MID", "age": 27, "overall": 72, "potential": 72, "pace": 64, "shooting": 54, "passing": 68, "defense": 64, "physical": 70}, {"name": "Brenden Aaronson", "position": "MID", "age": 25, "overall": 73, "potential": 75, "pace": 78, "shooting": 60, "passing": 66, "defense": 52, "physical": 58}, {"name": "Anton Stach", "position": "MID", "age": 26, "overall": 75, "potential": 78, "pace": 64, "shooting": 54, "passing": 68, "defense": 72, "physical": 78}, {"name": "Ao Tanaka", "position": "MID", "age": 27, "overall": 73, "potential": 73, "pace": 66, "shooting": 58, "passing": 68, "defense": 64, "physical": 66}, {"name": "Illan Gruev", "position": "MID", "age": 23, "overall": 68, "potential": 73, "pace": 62, "shooting": 46, "passing": 60, "defense": 64, "physical": 62}, {"name": "Dominic Calvert-Lewin", "position": "FWD", "age": 28, "overall": 74, "potential": 74, "pace": 62, "shooting": 72, "passing": 52, "defense": 32, "physical": 78}, {"name": "Joel Piroe", "position": "FWD", "age": 26, "overall": 74, "potential": 75, "pace": 66, "shooting": 72, "passing": 58, "defense": 32, "physical": 66}]}, "nottingham_forest": {"name": "Nottingham Forest FC", "players": [{"name": "Matz Sels", "position": "GK", "age": 33, "overall": 80, "potential": 80, "pace": 58, "shooting": 44, "passing": 68, "defense": 52, "physical": 76}, {"name": "Angus Gunn", "position": "GK", "age": 30, "overall": 70, "potential": 70, "pace": 58, "shooting": 42, "passing": 60, "defense": 42, "physical": 72}, {"name": "Neco Williams", "position": "DEF", "age": 24, "overall": 73, "potential": 76, "pace": 82, "shooting": 50, "passing": 64, "defense": 66, "physical": 66}, {"name": "Nikola Milenkovic", "position": "DEF", "age": 28, "overall": 78, "potential": 78, "pace": 66, "shooting": 44, "passing": 60, "defense": 78, "physical": 84}, {"name": "Murillo", "position": "DEF", "age": 23, "overall": 76, "potential": 82, "pace": 74, "shooting": 42, "passing": 58, "defense": 76, "physical": 78}, {"name": "Ola Aina", "position": "DEF", "age": 28, "overall": 73, "potential": 73, "pace": 76, "shooting": 48, "passing": 62, "defense": 68, "physical": 70}, {"name": "Ibrahim Sangare", "position": "MID", "age": 27, "overall": 76, "potential": 77, "pace": 66, "shooting": 58, "passing": 66, "defense": 74, "physical": 80}, {"name": "Elliot Anderson", "position": "MID", "age": 23, "overall": 76, "potential": 80, "pace": 72, "shooting": 60, "passing": 72, "defense": 60, "physical": 64}, {"name": "Morgan Gibbs-White", "position": "MID", "age": 25, "overall": 80, "potential": 82, "pace": 76, "shooting": 74, "passing": 78, "defense": 52, "physical": 64}, {"name": "James McAtee", "position": "MID", "age": 23, "overall": 74, "potential": 79, "pace": 68, "shooting": 64, "passing": 70, "defense": 50, "physical": 58}, {"name": "Callum Hudson-Odoi", "position": "MID", "age": 25, "overall": 73, "potential": 74, "pace": 84, "shooting": 66, "passing": 60, "defense": 36, "physical": 58}, {"name": "Nicolas Dominguez", "position": "MID", "age": 27, "overall": 75, "potential": 75, "pace": 62, "shooting": 58, "passing": 68, "defense": 72, "physical": 74}, {"name": "Igor Jesus", "position": "FWD", "age": 25, "overall": 74, "potential": 77, "pace": 72, "shooting": 72, "passing": 58, "defense": 36, "physical": 76}, {"name": "Chris Wood", "position": "FWD", "age": 34, "overall": 74, "potential": 74, "pace": 58, "shooting": 74, "passing": 52, "defense": 34, "physical": 80}, {"name": "Dan Ndoye", "position": "FWD", "age": 24, "overall": 76, "potential": 80, "pace": 86, "shooting": 70, "passing": 62, "defense": 38, "physical": 66}, {"name": "John Victor", "position": "GK", "age": 28, "overall": 68, "potential": 68, "pace": 56, "shooting": 40, "passing": 58, "defense": 40, "physical": 72}, {"name": "Morato", "position": "DEF", "age": 25, "overall": 70, "potential": 73, "pace": 58, "shooting": 38, "passing": 52, "defense": 70, "physical": 76}, {"name": "Nicolo Savona", "position": "DEF", "age": 21, "overall": 67, "potential": 74, "pace": 72, "shooting": 42, "passing": 56, "defense": 64, "physical": 66}, {"name": "Douglas Luiz", "position": "MID", "age": 27, "overall": 78, "potential": 78, "pace": 64, "shooting": 62, "passing": 76, "defense": 68, "physical": 68}, {"name": "Arnaud Kalimuendo", "position": "FWD", "age": 23, "overall": 74, "potential": 79, "pace": 76, "shooting": 72, "passing": 58, "defense": 32, "physical": 68}, {"name": "Omari Hutchinson", "position": "MID", "age": 22, "overall": 76, "potential": 82, "pace": 82, "shooting": 68, "passing": 68, "defense": 42, "physical": 58}]}, "sunderland": {"name": "Sunderland AFC", "players": [{"name": "Anthony Patterson", "position": "GK", "age": 26, "overall": 75, "potential": 77, "pace": 60, "shooting": 42, "passing": 66, "defense": 50, "physical": 76}, {"name": "Robin Roefs", "position": "GK", "age": 23, "overall": 73, "potential": 78, "pace": 58, "shooting": 40, "passing": 62, "defense": 46, "physical": 72}, {"name": "Dennis Cirkin", "position": "DEF", "age": 24, "overall": 71, "potential": 74, "pace": 74, "shooting": 48, "passing": 64, "defense": 66, "physical": 64}, {"name": "Daniel Ballard", "position": "DEF", "age": 26, "overall": 73, "potential": 75, "pace": 56, "shooting": 40, "passing": 54, "defense": 74, "physical": 78}, {"name": "Lutsharel Geertruida", "position": "DEF", "age": 25, "overall": 74, "potential": 76, "pace": 74, "shooting": 46, "passing": 64, "defense": 70, "physical": 72}, {"name": "Luke O'Nien", "position": "DEF", "age": 31, "overall": 68, "potential": 68, "pace": 60, "shooting": 42, "passing": 56, "defense": 66, "physical": 72}, {"name": "Noah Sadiki", "position": "MID", "age": 24, "overall": 71, "potential": 76, "pace": 66, "shooting": 48, "passing": 60, "defense": 70, "physical": 74}, {"name": "Enzo Le Fee", "position": "MID", "age": 26, "overall": 74, "potential": 76, "pace": 66, "shooting": 60, "passing": 72, "defense": 58, "physical": 62}, {"name": "Granit Xhaka", "position": "MID", "age": 33, "overall": 77, "potential": 77, "pace": 50, "shooting": 58, "passing": 78, "defense": 74, "physical": 74}, {"name": "Chemsdine Talbi", "position": "MID", "age": 21, "overall": 72, "potential": 80, "pace": 80, "shooting": 64, "passing": 64, "defense": 38, "physical": 58}, {"name": "Brian Brobbey", "position": "FWD", "age": 24, "overall": 73, "potential": 76, "pace": 70, "shooting": 70, "passing": 54, "defense": 32, "physical": 78}, {"name": "Eliezer Mayenda", "position": "FWD", "age": 21, "overall": 70, "potential": 79, "pace": 74, "shooting": 66, "passing": 52, "defense": 30, "physical": 72}, {"name": "Romaine Mundle", "position": "MID", "age": 23, "overall": 68, "potential": 74, "pace": 80, "shooting": 58, "passing": 56, "defense": 34, "physical": 54}, {"name": "Wilson Isidor", "position": "FWD", "age": 25, "overall": 71, "potential": 73, "pace": 66, "shooting": 68, "passing": 52, "defense": 30, "physical": 74}, {"name": "Simon Adingra", "position": "MID", "age": 24, "overall": 73, "potential": 77, "pace": 84, "shooting": 64, "passing": 60, "defense": 38, "physical": 60}, {"name": "Bertrand Traore", "position": "FWD", "age": 30, "overall": 70, "potential": 70, "pace": 74, "shooting": 66, "passing": 62, "defense": 34, "physical": 58}, {"name": "Trai Hume", "position": "DEF", "age": 23, "overall": 72, "potential": 76, "pace": 70, "shooting": 44, "passing": 58, "defense": 72, "physical": 74}, {"name": "Aji Alese", "position": "DEF", "age": 24, "overall": 68, "potential": 73, "pace": 74, "shooting": 44, "passing": 58, "defense": 66, "physical": 70}, {"name": "Nordi Mukiele", "position": "DEF", "age": 27, "overall": 74, "potential": 74, "pace": 78, "shooting": 48, "passing": 62, "defense": 72, "physical": 74}, {"name": "Reinildo Mandava", "position": "DEF", "age": 31, "overall": 71, "potential": 71, "pace": 66, "shooting": 42, "passing": 58, "defense": 70, "physical": 72}, {"name": "Chris Rigg", "position": "MID", "age": 18, "overall": 71, "potential": 84, "pace": 66, "shooting": 54, "passing": 64, "defense": 54, "physical": 62}, {"name": "Habib Diarra", "position": "MID", "age": 21, "overall": 74, "potential": 82, "pace": 70, "shooting": 58, "passing": 68, "defense": 66, "physical": 72}, {"name": "Omar Alderete", "position": "DEF", "age": 28, "overall": 72, "potential": 72, "pace": 58, "shooting": 42, "passing": 54, "defense": 74, "physical": 80}]}, "coventry_city": {"name": "Coventry City FC", "players": [{"name": "Carl Rushworth", "position": "GK", "age": 24, "overall": 71, "potential": 76, "pace": 58, "shooting": 40, "passing": 62, "defense": 44, "physical": 72}, {"name": "Milan van Ewijk", "position": "DEF", "age": 25, "overall": 71, "potential": 73, "pace": 76, "shooting": 48, "passing": 62, "defense": 66, "physical": 68}, {"name": "Jake Bidwell", "position": "DEF", "age": 32, "overall": 64, "potential": 64, "pace": 64, "shooting": 40, "passing": 58, "defense": 62, "physical": 64}, {"name": "Liam Kitching", "position": "DEF", "age": 25, "overall": 70, "potential": 73, "pace": 58, "shooting": 38, "passing": 52, "defense": 70, "physical": 76}, {"name": "Joel Latibeaudiere", "position": "DEF", "age": 25, "overall": 68, "potential": 70, "pace": 58, "shooting": 36, "passing": 52, "defense": 68, "physical": 72}, {"name": "Kaine Kesler-Hayden", "position": "DEF", "age": 22, "overall": 68, "potential": 73, "pace": 76, "shooting": 46, "passing": 60, "defense": 62, "physical": 64}, {"name": "Ben Sheaf", "position": "MID", "age": 25, "overall": 70, "potential": 72, "pace": 62, "shooting": 52, "passing": 66, "defense": 66, "physical": 70}, {"name": "Josh Eccles", "position": "MID", "age": 24, "overall": 68, "potential": 72, "pace": 62, "shooting": 54, "passing": 66, "defense": 58, "physical": 60}, {"name": "Victor Torp", "position": "MID", "age": 25, "overall": 69, "potential": 72, "pace": 64, "shooting": 56, "passing": 66, "defense": 60, "physical": 64}, {"name": "Ephron Mason-Clark", "position": "MID", "age": 26, "overall": 69, "potential": 70, "pace": 84, "shooting": 62, "passing": 58, "defense": 34, "physical": 58}, {"name": "Raphael Borges Rodrigues", "position": "DEF", "age": 26, "overall": 66, "potential": 66, "pace": 62, "shooting": 36, "passing": 52, "defense": 64, "physical": 68}, {"name": "Haji Wright", "position": "FWD", "age": 27, "overall": 72, "potential": 73, "pace": 70, "shooting": 72, "passing": 54, "defense": 32, "physical": 74}, {"name": "Brandon Thomas-Asante", "position": "FWD", "age": 26, "overall": 66, "potential": 66, "pace": 68, "shooting": 62, "passing": 48, "defense": 28, "physical": 72}, {"name": "Ben Wilson", "position": "GK", "age": 32, "overall": 63, "potential": 63, "pace": 52, "shooting": 38, "passing": 58, "defense": 42, "physical": 68}, {"name": "Luis Binks", "position": "DEF", "age": 25, "overall": 68, "potential": 71, "pace": 58, "shooting": 38, "passing": 52, "defense": 68, "physical": 74}, {"name": "Jay Dasilva", "position": "DEF", "age": 27, "overall": 66, "potential": 66, "pace": 72, "shooting": 44, "passing": 60, "defense": 62, "physical": 64}, {"name": "Bobby Thomas", "position": "DEF", "age": 24, "overall": 66, "potential": 69, "pace": 58, "shooting": 36, "passing": 50, "defense": 66, "physical": 74}, {"name": "Justin Obikwu", "position": "DEF", "age": 21, "overall": 60, "potential": 66, "pace": 68, "shooting": 36, "passing": 48, "defense": 58, "physical": 64}, {"name": "Matt Grimes", "position": "MID", "age": 29, "overall": 71, "potential": 71, "pace": 58, "shooting": 54, "passing": 72, "defense": 66, "physical": 64}, {"name": "Jack Rudoni", "position": "MID", "age": 23, "overall": 67, "potential": 71, "pace": 66, "shooting": 58, "passing": 64, "defense": 54, "physical": 58}, {"name": "Tatsuhiro Sakamoto", "position": "MID", "age": 27, "overall": 68, "potential": 68, "pace": 80, "shooting": 58, "passing": 60, "defense": 42, "physical": 58}, {"name": "Ellis Simms", "position": "FWD", "age": 24, "overall": 66, "potential": 70, "pace": 64, "shooting": 64, "passing": 48, "defense": 28, "physical": 74}, {"name": "Norman Bassette", "position": "FWD", "age": 21, "overall": 60, "potential": 66, "pace": 76, "shooting": 54, "passing": 46, "defense": 24, "physical": 58}, {"name": "Isaac Moore", "position": "FWD", "age": 20, "overall": 57, "potential": 65, "pace": 70, "shooting": 50, "passing": 42, "defense": 22, "physical": 56}]}, "ipswich_town": {"name": "Ipswich Town FC", "players": [{"name": "Arijanet Muric", "position": "GK", "age": 27, "overall": 72, "potential": 74, "pace": 58, "shooting": 42, "passing": 64, "defense": 46, "physical": 74}, {"name": "Leif Davis", "position": "DEF", "age": 26, "overall": 73, "potential": 75, "pace": 74, "shooting": 52, "passing": 68, "defense": 66, "physical": 66}, {"name": "Jacob Greaves", "position": "DEF", "age": 25, "overall": 69, "potential": 73, "pace": 58, "shooting": 38, "passing": 52, "defense": 68, "physical": 74}, {"name": "Cameron Burgess", "position": "DEF", "age": 29, "overall": 66, "potential": 66, "pace": 54, "shooting": 36, "passing": 48, "defense": 66, "physical": 76}, {"name": "Ben Johnson", "position": "DEF", "age": 25, "overall": 66, "potential": 68, "pace": 72, "shooting": 44, "passing": 58, "defense": 62, "physical": 64}, {"name": "Jens Cajuste", "position": "MID", "age": 26, "overall": 70, "potential": 72, "pace": 68, "shooting": 54, "passing": 62, "defense": 66, "physical": 74}, {"name": "Conor Chaplin", "position": "MID", "age": 27, "overall": 71, "potential": 71, "pace": 68, "shooting": 66, "passing": 66, "defense": 42, "physical": 58}, {"name": "Sammie Szmodics", "position": "MID", "age": 26, "overall": 72, "potential": 73, "pace": 78, "shooting": 68, "passing": 62, "defense": 38, "physical": 58}, {"name": "Jack Clarke", "position": "MID", "age": 25, "overall": 74, "potential": 77, "pace": 84, "shooting": 70, "passing": 64, "defense": 38, "physical": 60}, {"name": "George Hirst", "position": "FWD", "age": 24, "overall": 67, "potential": 70, "pace": 66, "shooting": 66, "passing": 50, "defense": 28, "physical": 70}, {"name": "Christian Walton", "position": "GK", "age": 29, "overall": 68, "potential": 68, "pace": 56, "shooting": 40, "passing": 58, "defense": 42, "physical": 70}, {"name": "Axel Tuanzebe", "position": "DEF", "age": 27, "overall": 66, "potential": 68, "pace": 66, "shooting": 40, "passing": 54, "defense": 66, "physical": 72}, {"name": "Harry Clarke", "position": "DEF", "age": 23, "overall": 68, "potential": 72, "pace": 70, "shooting": 44, "passing": 58, "defense": 66, "physical": 68}, {"name": "Luke Woolfenden", "position": "DEF", "age": 26, "overall": 66, "potential": 68, "pace": 56, "shooting": 38, "passing": 50, "defense": 66, "physical": 74}, {"name": "Sam Morsy", "position": "MID", "age": 33, "overall": 70, "potential": 70, "pace": 58, "shooting": 50, "passing": 62, "defense": 72, "physical": 76}, {"name": "Jack Taylor", "position": "MID", "age": 27, "overall": 66, "potential": 68, "pace": 64, "shooting": 50, "passing": 62, "defense": 58, "physical": 62}, {"name": "Azor Matusiwa", "position": "MID", "age": 26, "overall": 68, "potential": 70, "pace": 66, "shooting": 50, "passing": 60, "defense": 68, "physical": 70}, {"name": "Daniel Neil", "position": "MID", "age": 23, "overall": 68, "potential": 72, "pace": 66, "shooting": 54, "passing": 64, "defense": 60, "physical": 62}, {"name": "Marcelino Nunez", "position": "MID", "age": 25, "overall": 69, "potential": 71, "pace": 68, "shooting": 56, "passing": 66, "defense": 58, "physical": 60}, {"name": "Kasey McAteer", "position": "MID", "age": 23, "overall": 68, "potential": 72, "pace": 78, "shooting": 58, "passing": 60, "defense": 42, "physical": 58}, {"name": "Omari Hutchinson", "position": "MID", "age": 21, "overall": 75, "potential": 82, "pace": 80, "shooting": 66, "passing": 66, "defense": 42, "physical": 58}, {"name": "Anis Mehmeti", "position": "MID", "age": 23, "overall": 68, "potential": 72, "pace": 72, "shooting": 58, "passing": 62, "defense": 42, "physical": 56}, {"name": "Chiedozie Ogbene", "position": "FWD", "age": 28, "overall": 68, "potential": 68, "pace": 84, "shooting": 58, "passing": 50, "defense": 38, "physical": 74}]}, "hull_city": {"name": "Hull City AFC", "players": [{"name": "Ivor Pandur", "position": "GK", "age": 24, "overall": 70, "potential": 75, "pace": 58, "shooting": 40, "passing": 60, "defense": 44, "physical": 74}, {"name": "Lewie Coyle", "position": "DEF", "age": 29, "overall": 67, "potential": 67, "pace": 72, "shooting": 44, "passing": 58, "defense": 64, "physical": 66}, {"name": "Akin Famewo", "position": "DEF", "age": 27, "overall": 65, "potential": 65, "pace": 58, "shooting": 36, "passing": 50, "defense": 66, "physical": 74}, {"name": "John Egan", "position": "DEF", "age": 32, "overall": 68, "potential": 68, "pace": 52, "shooting": 38, "passing": 52, "defense": 70, "physical": 76}, {"name": "Charlie Hughes", "position": "DEF", "age": 23, "overall": 66, "potential": 71, "pace": 58, "shooting": 36, "passing": 50, "defense": 66, "physical": 74}, {"name": "Cody Drameh", "position": "DEF", "age": 23, "overall": 66, "potential": 70, "pace": 76, "shooting": 44, "passing": 58, "defense": 62, "physical": 62}, {"name": "Ryan Giles", "position": "DEF", "age": 25, "overall": 70, "potential": 73, "pace": 74, "shooting": 50, "passing": 68, "defense": 62, "physical": 62}, {"name": "Semi Ajayi", "position": "DEF", "age": 31, "overall": 65, "potential": 65, "pace": 54, "shooting": 38, "passing": 50, "defense": 66, "physical": 76}, {"name": "Regan Slater", "position": "MID", "age": 25, "overall": 67, "potential": 69, "pace": 68, "shooting": 52, "passing": 60, "defense": 64, "physical": 68}, {"name": "John Lundstram", "position": "MID", "age": 31, "overall": 68, "potential": 68, "pace": 60, "shooting": 52, "passing": 62, "defense": 68, "physical": 74}, {"name": "Eliot Matazo", "position": "MID", "age": 24, "overall": 66, "potential": 70, "pace": 64, "shooting": 48, "passing": 62, "defense": 60, "physical": 60}, {"name": "Matt Crooks", "position": "MID", "age": 31, "overall": 70, "potential": 70, "pace": 66, "shooting": 66, "passing": 62, "defense": 58, "physical": 74}, {"name": "Joe Gelhardt", "position": "FWD", "age": 23, "overall": 71, "potential": 76, "pace": 72, "shooting": 68, "passing": 58, "defense": 34, "physical": 64}, {"name": "Kieran Dowell", "position": "MID", "age": 27, "overall": 68, "potential": 68, "pace": 62, "shooting": 58, "passing": 66, "defense": 44, "physical": 54}, {"name": "Oli McBurnie", "position": "FWD", "age": 29, "overall": 72, "potential": 72, "pace": 58, "shooting": 72, "passing": 54, "defense": 32, "physical": 80}, {"name": "Kyle Joseph", "position": "FWD", "age": 24, "overall": 66, "potential": 70, "pace": 74, "shooting": 64, "passing": 48, "defense": 28, "physical": 66}]}};

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
    wage: Math.round(p.overall * 50), // crude placeholder — corrected the first time it passes through rolloverSeason
    wageSet: false,
    transferListed: false,
    askingPrice: null,
  };
}

function defaultCaptain(squad) {
  if (!squad.length) return null;
  return [...squad].sort((a, b) => b.leadership - a.leadership)[0].id;
}

// Reputation isn't flat — a club built around real quality talent starts
// with real prestige/expectations attached, same as a legacy big-market club
// vs a scrappy newly-promoted side in real life.
function computeReputation(squad) {
  if (!squad.length) return 50;
  const avgOverall = squad.reduce((s, p) => s + p.overall, 0) / squad.length;
  return clamp(Math.round((avgOverall - 60) * 4 + 50), 20, 95);
}

function makeClub({ name, squad, isReal, budget, academyEligible }) {
  return {
    id: uid(),
    name,
    isReal: !!isReal,
    squad,
    captainId: defaultCaptain(squad),
    tactics: { formation: "4-4-2", style: "balanced", press: "medium", lineupMode: "best", restThreshold: 0 },
    budget: budget ?? randInt(3_000_000, 8_000_000),
    reputation: computeReputation(squad),
    academyEligible: !!academyEligible,
    academyStars: 0,
    academyInvested: 0,
    youthPlayers: [],
    tryoutCandidates: [],
    boardHappiness: 60,
    boardObjective: null,
    designatedPlayerIds: [],
    conference: null,
    disqualified: false,
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
// Real academies run a curated intake, not an open-ended pipeline — capping
// it keeps the youth ranks feeling like a hand-picked crop of prospects
// rather than a warehouse you keep stocking indefinitely.
const ACADEMY_MAX_PROSPECTS = 10;

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
    wage: Math.round(p.overall * 30), wageSet: false, transferListed: false, askingPrice: null,
  };
}

// Real transfer fees for academy prospects track CURRENT ability first —
// scouts pay a premium for a promising ceiling, but a modest one, not the
// reverse. The old formula scaled off raw potential alone
// (pow(potential, 2.4)), so a barely-developed prospect with a lucky high
// potential roll could fetch six figures before ever playing a competitive
// minute. Below a 60 overall — genuinely still a project, not yet
// first-team caliber — value now stays low and grows with actual ability,
// with a capped potential bonus layered on top. At 60+ overall, a prospect
// is priced exactly like a real player (using the same market curve),
// never more.
function youthSaleValue(p) {
  if (p.overall >= 60) {
    return marketValue({ ...p, morale: p.morale ?? 60 });
  }
  const baseValue = 500 * Math.pow(1.09, p.overall);
  const potentialGap = Math.max(0, p.potential - p.overall);
  const potentialBonus = 1 + Math.min(potentialGap * 0.01, 0.6);
  return Math.max(20_000, Math.round((baseValue * potentialBonus) / 100) * 100);
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
   HINTS — simple rule-based "what should I do next" suggestions
   ============================================================ */

function computeHints(club, matchday, seenOneTimeHints, recentForm, tier) {
  const seen = seenOneTimeHints instanceof Set ? seenOneTimeHints : new Set(seenOneTimeHints || []);
  const hints = [];
  // Recurring, state-dependent hints always get a fresh check every time —
  // these change as the season goes, so they should keep coming back.
  const push = (id, text) => hints.push({ id, text, oneTime: false });
  // One-time hints explain a mechanic or nudge toward a feature — once
  // you've seen the explanation, it's noise to keep repeating it. These
  // only get added if not already in the seen set.
  const pushOnce = (id, text) => { if (!seen.has(id)) hints.push({ id, text, oneTime: true }); };

  // Losing streak — tied to what's actually set right now, not a generic
  // "check the market" nudge. This is the "how do I get out of a rut"
  // answer: a concrete suggestion based on the tactics currently in use.
  const lastThree = (recentForm || []).slice(-3);
  if (lastThree.length === 3 && lastThree.every((r) => r === "L")) {
    let suggestion;
    if (club.tactics.style === "attacking") suggestion = "dialing back to a balanced or defensive style — you may be getting caught out at the back";
    else if (club.tactics.press === "high") suggestion = "dropping to a medium or low press to stay more compact";
    else suggestion = "checking the Tactics tab — the suggested setup there is based on your actual squad, not a guess";
    push("losing-streak", `You've lost your last 3 — try ${suggestion}. Also worth scouting your next opponent from the Fixtures tab before kickoff.`);
  }

  const unhappyPlayers = club.squad.filter((p) => p.transferRequested);
  if (unhappyPlayers.length > 0) {
    const names = unhappyPlayers.slice(0, 2).map((p) => p.name).join(", ");
    push("unhappy-players", `${unhappyPlayers.length === 1 ? `${names} has` : `${names}${unhappyPlayers.length > 2 ? " and others" : ""} have`} asked to leave after being left out — they're listed on the Market at a discount. Play them more or let them go.`);
  }

  const lineRatings = clubLineRatings(club);
  if (lineRatings.def > 0 && lineRatings.def < 2.5) push("thin-def", "Your defense is thin (under 2.5 stars) — check the Market's ★ Recommended tab for a defender.");
  if (lineRatings.mid > 0 && lineRatings.mid < 2.5) push("thin-mid", "Your midfield is under 2.5 stars — check the Market's ★ Recommended tab, a signing there could lift the whole team.");
  if (lineRatings.att > 0 && lineRatings.att < 2.5) push("thin-att", "Your attack is under 2.5 stars — check the Market's ★ Recommended tab, you may be short of goals.");

  const expiring = club.squad.filter((p) => p.contractYearsLeft <= 1);
  if (expiring.length > 0) {
    const names = expiring.slice(0, 3).map((p) => p.name).join(", ");
    push("expiring-contracts", `${expiring.length === 1 ? `${names}'s` : `${expiring.length} deals (${names}${expiring.length > 3 ? ", ..." : ""})`} expiring soon — renew from the Squad tab before you lose them for nothing.`);
  }

  if (club.academyStars > 0) {
    const ready = club.youthPlayers.filter((p) => p.age >= ACADEMY_PROMOTE_MIN_AGE);
    if (ready.length > 0) push("prospects-ready", `${ready.length} academy prospect${ready.length === 1 ? " is" : "s are"} old enough to promote to the first team.`);
    if (club.academyStars < 5) pushOnce("academy-invest-tip", `Your academy is ${club.academyStars}-star — investing further would speed up development and raise the ceiling on new prospects.`);
  }
  if (club.academyEligible && club.academyStars === 0 && club.budget >= ACADEMY_START_COST) {
    pushOnce("academy-eligible-tip", "You're eligible to start an academy and can afford it — a long-term investment in your own talent pipeline.");
  }
  if (!club.academyEligible && club.tryoutCandidates.length === 0) {
    push("host-tryouts", "Consider hosting open tryouts — cheap, and every so often turns up a player better than your level.");
  }

  const xi = startingXI(club, matchday);
  if (xi.length < 11) push("short-xi", `You can only field ${xi.length} — injuries or suspensions are biting into your lineup.`);

  if (club.squad.length < MIN_SQUAD_SIZE) push("thin-squad", `Your squad is thin (under ${MIN_SQUAD_SIZE} players) — a long season could leave you short.`);

  if (club.budget < 300_000) push("low-budget", "Budget is very low — selling a listed player or two could ease the pressure.");

  const captain = club.squad.find((p) => p.id === club.captainId);
  if (captain && captain.leadership < 55) push("weak-captain", `Your captain (${captain.name}) has modest leadership (${captain.leadership}) — a more natural leader in your XI might lift team chemistry.`);

  // These stay relevant even when nothing above fired — always leave the
  // player with a next step rather than just "everything's fine."
  const weakest = ["def", "mid", "att"].reduce((a, b) => (lineRatings[a] <= lineRatings[b] ? a : b));
  const weakestLabel = { def: "defense", mid: "midfield", att: "attack" }[weakest];
  push("weakest-line", `Your ${weakestLabel} is your weakest line (${lineRatings[weakest]}★) — the Market's ★ Recommended tab is worth a scan even if nothing's urgent there.`);

  if (club.tactics.lineupMode === "best") {
    pushOnce("lineup-mode-tip", "You're on Best XI — switching to Auto occasionally keeps players fresher, or try Youth to develop your prospects faster.");
  }

  if (hints.length < 2) {
    push("all-clear", "Squad and finances look solid — a good time to check the Draft or Market for a squad upgrade before your rivals do.");
  }

  return hints;
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
    contractYearsLeft: randInt(2, 4), wage: Math.round(overall * 40), wageSet: false,
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
  // Founding MLS clubs start with an already-established academy — a perk
  // of being top-flight from day one. A club that gets promoted into MLS
  // later doesn't get this for free; they have to build their own.
  mlsClubs.forEach((c) => {
    c.academyStars = randInt(2, 3);
    c.academyInvested = ACADEMY_STAR_THRESHOLDS[c.academyStars];
    c.conference = initialMlsConference(c.name);
    // An already-established academy comes with an already-established
    // crop of prospects, not an empty pipeline you have to build from
    // scratch on day one.
    const startingCount = randInt(3, 5);
    c.youthPlayers = Array.from({ length: startingCount }, () => generateAcademyProspect(c.academyStars));
  });
  ensureMlsConferences(mlsClubs); // balances any expansion filler clubs that aren't real East/West members

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

// One-line "what this is good for" so the formation buttons aren't just
// unlabeled shapes — helps connect the choice to your actual squad.
const FORMATION_NOTES = {
  "4-4-2": "Balanced and simple — solid if your squad doesn't lean hard toward attack or defense.",
  "4-3-3": "Rewards a strong front line and wide attacking players — needs goals to back it up.",
  "3-5-2": "Midfield-heavy — best with a deep, strong MID line to control games, but thinner at the back.",
  "5-3-2": "Extra defensive cover — good if your DEF is your strongest line or you're facing a tough attack.",
  "4-2-3-1": "Flexible, MID-heavy setup — good if you have one standout striker and depth through the middle.",
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

// Best XI = your most talented available players, full stop — fitness and
// morale still affect how well they PERFORM once selected (via
// effectiveRating during match simulation), but shouldn't reorder who gets
// picked in the first place. Previously this used effectiveRating for
// selection too, so a much lower-overall but fully-fit player could
// outrank a genuine star who was merely tired — "Best XI" wasn't
// actually picking your best players. A small penalty only kicks in once
// fitness gets genuinely risky (below 40), as a fatigue-injury safety
// margin, not a ranking swing. Youth prioritizes youngest players (weaker
// on paper, but they get the caps/growth), tie-broken by rating. Auto is
// rating with a fitness nudge, so tired starters naturally rotate for
// fresher legs rather than always fielding the same XI regardless of
// fatigue.
function lineupScore(mode, p) {
  if (mode === "youth") return -p.age * 1000 + effectiveRating(p);
  if (mode === "auto") return effectiveRating(p) + p.fitness * 0.15;
  if (mode === "best") return p.overall - (p.fitness < 40 ? (40 - p.fitness) * 0.5 : 0);
  return effectiveRating(p);
}

// Formation-aware XI picker: fills each positional bucket according to the
// club's lineup mode, then backfills any shortfall with the best remaining
// available players so a thin squad still fields close to 11. This is also
// used by the Tactics tab to preview the projected lineup before playing it.
// Cup matches always use the 9999 sentinel matchday — used here to detect
// "this is a cup match" so hold-back-for-cup preferences apply.
function startingXI(club, matchday) {
  const mode = club.tactics.lineupMode || "best";
  const isCupMatch = matchday === 9999;
  const restThreshold = club.tactics.restThreshold ?? 0;
  const hardAvailable = club.squad.filter((p) => isAvailable(p, matchday));
  // Rest preferences apply regardless of lineup mode — Best/Youth/Auto all
  // respect them the same way, they just change who's eligible to be
  // picked FROM, not how picking within that pool works.
  let available = hardAvailable.filter((p) => {
    if (isCupMatch && p.holdBackForCup) return false;
    if (p.restRequested) return false;
    if (p.fitness < restThreshold) return false;
    return true;
  });
  // Safety valve: rest/hold-back preferences should never leave a club
  // unable to field a real team — if they'd drop available players below
  // a full XI, fall back to everyone who's actually fit to play instead.
  if (available.length < 11) available = hardAvailable;

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
    // backfill only from outfield players — a reserve keeper should never
    // end up filling an outfield slot just because he's next-best-rated
    const remaining = available.filter((p) => !chosenIds.has(p.id) && p.position !== "GK").sort((a, b) => lineupScore(mode, b) - lineupScore(mode, a));
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
// Star ratings are for display/reasoning only — the actual match engine
// uses raw overalls via effectiveRating/squadStrength, never these star
// buckets.
//
// This briefly used a percentile-within-tier scale instead of this fixed
// formula, to spread ratings out more (checked against real MLS data, the
// fixed formula did compress 28 of 30 clubs into a single 2.5★ defense
// bucket). But percentile ranking meant a tier's best club always showed
// 5★ regardless of that tier's actual absolute quality — a "5-star" USL
// Championship defense could still lose to a mediocre MLS attack, which
// read as nonsensical ("5 stars in all but I still lose"). Reverted back
// to the absolute scale: stars reflect real ability level, not just rank
// within your own tier, even if that means some tiers rarely show the
// full range.
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
  if (xi.length === 0) return 1.0;
  let captain = xi.find((p) => p.id === club.captainId);
  if (!captain) {
    // The designated captain isn't in today's XI (injured, suspended,
    // rotated out) — real teams don't just play without a captain, the
    // armband passes to whoever's actually out there with the highest
    // leadership instead of the bonus going unused.
    captain = [...xi].sort((a, b) => b.leadership - a.leadership)[0];
  }
  return clamp(1 + (captain.leadership - 50) / 1000, 0.95, 1.05);
}

// Playing alongside a genuine Designated Player star gives the whole team a
// small confidence lift — separate from and stacked on top of the
// captaincy bonus, capped so it's a nice-to-have rather than a way to
// trivialize match strength through DP stacking alone.
function dpAuraFactor(club, xi) {
  const dpSet = new Set(club.designatedPlayerIds || []);
  if (dpSet.size === 0) return 1.0;
  const dpInXi = xi.filter((p) => dpSet.has(p.id)).length;
  return 1 + Math.min(dpInXi * DP_XI_AURA_PER_PLAYER, DP_XI_AURA_CAP);
}

function squadStrength(club, matchday) {
  const xi = startingXI(club, matchday);
  if (xi.length === 0) return 0;
  const avg = xi.reduce((s, p) => s + effectiveRating(p), 0) / xi.length;
  return avg * captainChemistryFactor(club, xi) * dpAuraFactor(club, xi);
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

const UNHAPPY_BENCH_STREAK_THRESHOLD = 6;
const UNHAPPY_MORALE_THRESHOLD = 15;

// A fit player left out of the XI match after match gets restless — real
// squad players expect game time, and a manager who never rotates or
// never plays a good player will eventually see them ask to leave. Skipped
// entirely in Rookie mode, which is meant to be consequence-light while
// learning the systems; Pro and Executive both have it active.
function applyBenchUnhappiness(club, xi, difficulty) {
  if (difficulty === "rookie") return;
  const xiIds = new Set(xi.map((p) => p.id));
  club.squad.forEach((p) => {
    if (xiIds.has(p.id)) {
      p.benchStreak = 0;
      return;
    }
    // an injured or suspended player sitting out isn't a squad-management
    // complaint — only fit players building frustration from being left
    // out count here
    if (p.injuredUntilMatchday != null || p.suspendedUntilMatchday != null) return;
    p.benchStreak = (p.benchStreak || 0) + 1;
    p.morale = clamp(p.morale - 1, 0, 100);
    if (!p.transferRequested && !p.transferListed && (p.benchStreak >= UNHAPPY_BENCH_STREAK_THRESHOLD || p.morale <= UNHAPPY_MORALE_THRESHOLD)) {
      if (Math.random() < 0.15) {
        p.transferRequested = true;
        p.transferListed = true;
        p.askingPrice = Math.round(marketValue({ ...p, morale: p.morale ?? 60 }) * 0.85);
      }
    }
  });
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
function applyCardsAndInjuries(xi, clubName, matchday, events, difficulty) {
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

  // Injury risk is now per-player and fitness-dependent — a tired player
  // is meaningfully more likely to pick up a knock than a fresh one,
  // which is the actual payoff for rest/rotation mattering at all. Rookie
  // mode dials the overall rate down since it's meant to be the gentler,
  // learn-the-game difficulty — the feature exists everywhere, but its
  // bite depends on which mode you're in.
  const injuryMultiplier = DIFFICULTY_MODES[difficulty]?.injuryMultiplier ?? 1.0;
  xi.forEach((p) => {
    if (sentOff.has(p.id)) return; // already off — no fresh injury on top of a red card
    const fitnessRisk = p.fitness < 50 ? ((50 - p.fitness) / 50) * 0.05 : 0;
    const chance = (INJURY_BASE_RATE / xi.length + fitnessRisk) * injuryMultiplier;
    if (Math.random() < chance) {
      const duration = choice([1, 1, 2, 2, 3, 5]);
      p.injuredUntilMatchday = matchday + duration;
      events.push({ type: "injury", club: clubName, player: p.name, outFor: duration });
    }
  });
}

function simulateMatch(fixture, home, away, matchday, difficulty) {
  const homeXI = startingXI(home, matchday);
  const awayXI = startingXI(away, matchday);
  recordAppearances(homeXI, matchday);
  recordAppearances(awayXI, matchday);
  // A "rest next match" request is used up once that match is actually
  // played, whether the player sat out or (safety valve) had to play
  // anyway — either way, this match was their "next match."
  home.squad.forEach((p) => { p.restRequested = false; });
  away.squad.forEach((p) => { p.restRequested = false; });

  const homeXg = expectedGoals(home, away, matchday, true);
  const awayXg = expectedGoals(away, home, matchday, false);
  const homeGoals = samplePoisson(homeXg);
  const awayGoals = samplePoisson(awayXg);

  const events = [];
  for (let i = 0; i < homeGoals; i++) {
    const scorer = homeXI.length ? weightedScorer(homeXI) : null;
    if (scorer) scorer.seasonGoals = (scorer.seasonGoals || 0) + 1;
    events.push({ type: "goal", club: home.name, player: scorer ? scorer.name : "Unknown", minute: randInt(1, 90) });
  }
  for (let i = 0; i < awayGoals; i++) {
    const scorer = awayXI.length ? weightedScorer(awayXI) : null;
    if (scorer) scorer.seasonGoals = (scorer.seasonGoals || 0) + 1;
    events.push({ type: "goal", club: away.name, player: scorer ? scorer.name : "Unknown", minute: randInt(1, 90) });
  }
  events.sort((a, b) => (a.type === "goal" ? a.minute : 999) - (b.type === "goal" ? b.minute : 999));

  applyCardsAndInjuries(homeXI, home.name, matchday, events, difficulty);
  applyCardsAndInjuries(awayXI, away.name, matchday, events, difficulty);

  let homeResult, awayResult;
  if (homeGoals > awayGoals) { homeResult = "win"; awayResult = "loss"; }
  else if (homeGoals < awayGoals) { homeResult = "loss"; awayResult = "win"; }
  else { homeResult = awayResult = "draw"; }

  applyFitnessAndMorale(homeXI, homeResult);
  applyFitnessAndMorale(awayXI, awayResult);
  applyBenchUnhappiness(home, homeXI, difficulty);
  applyBenchUnhappiness(away, awayXI, difficulty);

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
// On Pro/Executive, clubs actually have to fund a real payroll out of this
// money, so the deposit scales up accordingly — mainly matters for MLS,
// where wages can run high; the other tiers' payrolls were already roughly
// in range of their Rookie-level deposit.
const OWNERSHIP_DEPOSIT_WAGED = [16_000_000, 2_400_000, 1_000_000, 350_000];
function ownershipDepositFor(tierIdx, difficulty) {
  return DIFFICULTY_MODES[difficulty]?.wagesDeducted ? OWNERSHIP_DEPOSIT_WAGED[tierIdx] : OWNERSHIP_DEPOSIT[tierIdx];
}

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

// Real-calibrated season-end bonuses for Pro/Executive mode. For MLS this is
// currently Shield-style money (best regular-season record) — the actual
// MLS Cup / conference / playoff-qualifier bonuses layer in once playoffs
// exist, since those are genuinely playoff-outcome money, not table money.
// USL League Two is intentionally all zeros — amateur status, no bonuses.
const SEASON_BONUS = [
  { champion: 55_000, runnerUp: 20_000, midBand: 8_000, rest: 2_000 }, // MLS
  { champion: 40_000, runnerUp: 15_000, midBand: 5_000, rest: 1_000 }, // USL Championship
  { champion: 20_000, runnerUp: 8_000, midBand: 2_500, rest: 500 }, // USL League One
  { champion: 0, runnerUp: 0, midBand: 0, rest: 0 }, // USL League Two
];

function computeEventBonuses(table, tierIdx) {
  const cfg = SEASON_BONUS[tierIdx];
  const amounts = {};
  table.forEach((row, i) => {
    let amt;
    if (i === 0) amt = cfg.champion;
    else if (i === 1) amt = cfg.runnerUp;
    else if (i < 8) amt = cfg.midBand;
    else amt = cfg.rest;
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

// A club can't field a competitive team below this — real leagues require a
// minimum registered roster, and a squad this thin can't survive a single
// bad injury run without failing to have 11 fit players.
const MIN_SQUAD_SIZE = 16;

// Flat emergency funding per missing player, scaled by tier (MLS running out
// of players costs a lot more to fix than a USL2 club needing a couple of
// amateurs) — this is what a club gets when it drops below the minimum
// squad size, meant to be enough to realistically sign back up to strength,
// not free extra budget.
const DISQUALIFICATION_FUNDING_PER_PLAYER = [400_000, 120_000, 50_000, 15_000];

// Checks whether a club has enough players to field a team, and applies or
// clears the "disqualified" flag accordingly. A club dropping below the
// minimum gets a one-time flat injection (scaled by tier, financial
// situation, and how many players they're actually short) to help dig out —
// while disqualified their fixtures still simulate (see
// simulateMatchdayAcrossTiers) but always resolve as a loss, since they
// can't field a real side. Returns { club, notice } — notice is only set on
// the season a club newly crosses into or out of disqualification.
function applyDisqualificationCheck(club, tierIdx) {
  const short = MIN_SQUAD_SIZE - club.squad.length;
  if (short > 0) {
    if (club.disqualified) return { club, notice: null }; // already flagged, no repeat payout
    // Deeper in debt (or already thin on funds) gets proportionally more —
    // a well-funded club just needs the transfer money, a broke one needs
    // real help to climb back to a legal roster.
    const financialMultiplier = club.budget < 0 ? 1.6 : club.budget < 1_000_000 ? 1.25 : 1.0;
    const funding = Math.round(short * DISQUALIFICATION_FUNDING_PER_PLAYER[tierIdx] * financialMultiplier);
    return {
      club: { ...club, disqualified: true, budget: club.budget + funding },
      notice: { clubName: club.name, short, funding, resolved: false },
    };
  }
  if (club.disqualified) {
    return { club: { ...club, disqualified: false }, notice: { clubName: club.name, resolved: true } };
  }
  return { club, notice: null };
}

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

/* ============================================================
   PLAYOFFS — MLS Cup bracket + lower-tier promotion playoffs
   ============================================================ */

// Real 2026 MLS conference alignment for the 30 original clubs. Any club
// that enters MLS later (promoted from USL Championship, or an expansion
// filler) doesn't have a real-world conference, so it gets assigned
// whichever side is currently smaller — and that assignment sticks on the
// club from then on, so the split can't silently drift lopsided over a long
// save (which used to make the whole bracket function bail out entirely).
const MLS_EAST_CLUBS = new Set([
  "Atlanta United FC", "CF Montréal", "Charlotte FC", "Chicago Fire FC", "Columbus Crew",
  "D.C. United", "FC Cincinnati", "Inter Miami CF", "Nashville SC", "New England Revolution",
  "New York City FC", "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Toronto FC",
]);

function initialMlsConference(clubName) {
  return MLS_EAST_CLUBS.has(clubName) ? "East" : null; // null = not an original club, needs balancing
}

// Ensures every MLS club has a sticky conference, self-balancing any club
// that doesn't have a real-world one yet (new expansion filler, or a club
// freshly promoted from USL Championship).
function ensureMlsConferences(mlsClubs) {
  mlsClubs.forEach((c) => {
    if (c.conference !== "East" && c.conference !== "West") {
      const eastCount = mlsClubs.filter((x) => x.conference === "East").length;
      const westCount = mlsClubs.filter((x) => x.conference === "West").length;
      c.conference = eastCount <= westCount ? "East" : "West";
    }
  });
}

// Resolves a single knockout match to a decisive winner — no draws allowed
// in playoff football, so a tied 90 minutes goes to a simplified penalty
// shootout weighted by relative squad strength rather than a full
// kick-by-kick simulation.
function resolveKnockoutMatch(home, away, matchday) {
  const fixture = { homeScore: null, awayScore: null, played: false };
  const result = simulateMatch(fixture, home, away, matchday);
  if (fixture.homeScore === fixture.awayScore) {
    const homeStrength = squadStrength(home, matchday);
    const awayStrength = squadStrength(away, matchday);
    const total = homeStrength + awayStrength;
    const homeWinChance = total > 0 ? homeStrength / total : 0.5;
    const homeWon = Math.random() < homeWinChance;
    return { winner: homeWon ? home : away, result, wentToPenalties: true };
  }
  return { winner: fixture.homeScore > fixture.awayScore ? home : away, result, wentToPenalties: false };
}

// Best-of-three: higher seed hosts games 1 and 3, lower seed hosts game 2.
// Each individual game still can't end level, so ties go to the same
// simplified shootout as any other knockout match.
function bestOfThreeSeries(higherSeed, lowerSeed, matchday) {
  let hWins = 0, lWins = 0;
  const games = [];
  for (let g = 0; g < 3 && hWins < 2 && lWins < 2; g++) {
    const homeIsHigher = g !== 1;
    const home = homeIsHigher ? higherSeed : lowerSeed;
    const away = homeIsHigher ? lowerSeed : higherSeed;
    const outcome = resolveKnockoutMatch(home, away, matchday);
    games.push(outcome);
    if (outcome.winner.id === higherSeed.id) hWins++; else lWins++;
  }
  return { winner: hWins > lWins ? higherSeed : lowerSeed, games, hWins, lWins };
}

// Full 18-team MLS Cup Playoffs: wild card, best-of-three Round One, single-
// elimination conference semis/finals, then the Cup final. Purely a trophy
// and bonus exercise — it never affects promotion or relegation.
function runMlsPlayoffs(mlsTable, mlsClubs, matchday) {
  ensureMlsConferences(mlsClubs);
  const clubById = (id) => mlsClubs.find((c) => c.id === id);

  function runConference(conferenceName) {
    const rows = mlsTable.filter((r) => clubById(r.clubId)?.conference === conferenceName);
    if (rows.length < 9) return null;
    const seeds = rows.slice(0, 9).map((r) => clubById(r.clubId)).filter(Boolean);
    if (seeds.length < 9) return null;
    const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = seeds;
    const wildcard = resolveKnockoutMatch(s8, s9, matchday);
    const r1a = bestOfThreeSeries(s1, wildcard.winner, matchday);
    const r1b = bestOfThreeSeries(s2, s7, matchday);
    const r1c = bestOfThreeSeries(s3, s6, matchday);
    const r1d = bestOfThreeSeries(s4, s5, matchday);
    const semiA = resolveKnockoutMatch(r1a.winner, r1d.winner, matchday);
    const semiB = resolveKnockoutMatch(r1b.winner, r1c.winner, matchday);
    const confFinal = resolveKnockoutMatch(semiA.winner, semiB.winner, matchday);
    return { champion: confFinal.winner, seeds, wildcard, r1a, r1b, r1c, r1d, semiA, semiB, confFinal };
  }

  const east = runConference("East");
  const west = runConference("West");
  if (!east || !west) return null;

  const eastRank = mlsTable.findIndex((r) => r.clubId === east.champion.id);
  const westRank = mlsTable.findIndex((r) => r.clubId === west.champion.id);
  const finalHome = eastRank <= westRank ? east.champion : west.champion;
  const finalAway = finalHome.id === east.champion.id ? west.champion : east.champion;
  const finalResult = resolveKnockoutMatch(finalHome, finalAway, matchday);

  const qualifiers = new Set([...east.seeds, ...west.seeds].map((c) => c.id));
  const finalists = new Set([east.champion.id, west.champion.id]);
  const otherQualifiers = [...qualifiers].filter((id) => !finalists.has(id));

  return {
    east, west,
    champion: finalResult.winner,
    runnerUp: finalResult.winner.id === east.champion.id ? west.champion : east.champion,
    finalResult,
    otherQualifiers,
  };
}

// For USL Championship / League One / League Two→League One boundaries: top
// 2 by table promote automatically, and the last spot goes to a 4-team
// playoff among 3rd-6th place (3v6, 4v5 semis, then a final).
function runPromotionPlayoff(lowerTable, lowerTierClubs, matchday) {
  if (lowerTable.length < 6) return { autoPromoted: lowerTable.slice(0, 2).map((r) => r.clubId), playoffPromoted: lowerTable[2]?.clubId, bracket: null };
  const clubById = (id) => lowerTierClubs.find((c) => c.id === id);
  const autoPromoted = lowerTable.slice(0, 2).map((r) => r.clubId);
  const s3 = clubById(lowerTable[2].clubId), s4 = clubById(lowerTable[3].clubId);
  const s5 = clubById(lowerTable[4].clubId), s6 = clubById(lowerTable[5].clubId);
  const semi1 = resolveKnockoutMatch(s3, s6, matchday);
  const semi2 = resolveKnockoutMatch(s4, s5, matchday);
  const final = resolveKnockoutMatch(semi1.winner, semi2.winner, matchday);
  return { autoPromoted, playoffPromoted: final.winner.id, bracket: { semi1, semi2, final } };
}

// A flat (no conferences) single-elimination bracket seeded straight off the
// table — used for USL Championship's real playoff, which crowns its own
// champion separately from the regular-season "Players' Shield" table
// topper, same relationship as MLS Cup vs Supporters' Shield.
function runFlatPlayoffBracket(table, clubs, matchday, size) {
  if (table.length < size) return null;
  const clubById = (id) => clubs.find((c) => c.id === id);
  const seeds = table.slice(0, size).map((r) => clubById(r.clubId));
  const pairIndices = [];
  for (let i = 0; i < size / 2; i++) pairIndices.push([i, size - 1 - i]);
  let currentRound = pairIndices.map(([a, b]) => [seeds[a], seeds[b]]);
  const rounds = [];
  let finalMatchup = null;
  let champion = null;
  while (currentRound.length > 0) {
    const results = currentRound.map(([home, away]) => resolveKnockoutMatch(home, away, matchday));
    rounds.push(results);
    if (results.length === 1) {
      finalMatchup = currentRound[0];
      champion = results[0].winner;
      break;
    }
    const winners = results.map((r) => r.winner);
    const nextPairs = [];
    for (let i = 0; i < winners.length; i += 2) nextPairs.push([winners[i], winners[i + 1]]);
    currentRound = nextPairs;
  }
  const runnerUp = finalMatchup[0].id === champion.id ? finalMatchup[1] : finalMatchup[0];
  return { champion, runnerUp, rounds, qualifiers: seeds.map((c) => c.id) };
}

/* ============================================================
   US OPEN CUP — real bracket structure, adapted for this world's roster
   sizes (30 MLS / 25 USLC / 17 USL1 / 20 USL2). Entrants join at
   different rounds, same as the real tournament: all 20 USL2 clubs start
   in Round 1; all 17 USL1 clubs plus the top 16 USLC clubs (by standings)
   join at Round 2; the bottom 16 MLS clubs (by standings — the rest are
   presumed occupied elsewhere) join once the bracket reaches "Round of
   32". A single-elimination, one-off match throughout — no home/away
   legs. Whenever the pool at a round is odd, one random entrant gets a
   bye to the next round, same as the real Open Cup handles byes.
   ============================================================ */

// A cup match couldn't care less about a club's league position — every
// entrant here is wrapped with the tier it came from, purely so the
// giant-killer bonus (a lower-league team beating a higher-league one)
// can be detected and so the bracket display can show tier badges.
function drawCupPairs(entrants) {
  const roster = shuffle(entrants);
  let byeEntrant = null;
  if (roster.length % 2 === 1) byeEntrant = roster.pop();
  const pairs = [];
  for (let i = 0; i < roster.length; i += 2) pairs.push([roster[i], roster[i + 1]]);
  return { pairs, byeEntrant };
}

function resolveCupPairs(pairs, matchday) {
  return pairs.map(([homeEntrant, awayEntrant]) => {
    const outcome = resolveKnockoutMatch(homeEntrant.club, awayEntrant.club, matchday);
    const winnerEntrant = outcome.winner.id === homeEntrant.club.id ? homeEntrant : awayEntrant;
    const loserEntrant = winnerEntrant === homeEntrant ? awayEntrant : homeEntrant;
    // Giant-killer: a club from a numerically higher tier index (a lower
    // league) beating one from a lower tier index (a higher league).
    const isUpset = winnerEntrant.tierIdx > loserEntrant.tierIdx;
    return { homeEntrant, awayEntrant, outcome, winnerEntrant, loserEntrant, isUpset };
  });
}

function playCupRound(entrants, matchday) {
  const { pairs, byeEntrant } = drawCupPairs(entrants);
  const matches = resolveCupPairs(pairs, matchday);
  const advancing = byeEntrant ? [...matches.map((m) => m.winnerEntrant), byeEntrant] : matches.map((m) => m.winnerEntrant);
  return { matches, byeEntrant, advancing };
}

const US_OPEN_CUP_CHAMPION_PRIZE = 600_000;
const US_OPEN_CUP_RUNNERUP_PRIZE = 250_000;
const US_OPEN_CUP_GIANT_KILLER_BONUS = 50_000;

// Deterministic given this world's fixed pyramid sizes (20/17/16/16
// entrants joining at their fixed points always cascades through exactly
// 8 rounds to a single champion).
const US_OPEN_CUP_TOTAL_ROUNDS = 8;

// The cup runs DURING the season now, not after it — these are the league
// matchday numbers before which a cup round is due. When the next league
// matchday equals one of these, league play for that turn is replaced by
// a cup round instead (the league fixtures aren't skipped, just delayed —
// they play out normally on the next turn once the cup round is cleared).
// Spread through the first half of the season and capped at 17 so it
// still fits and wraps up comfortably even for USL1 (this world's
// shortest single round-robin, at 17 matchdays), while finishing well
// before MLS's own regular season and playoffs.
const US_OPEN_CUP_ROUND_MATCHDAYS = [3, 5, 7, 9, 11, 13, 15, 17];

// Shared by the bulk-sim loops (checking against a live `next` draft) and
// the component-level pending-round indicator (checking against `state`) —
// both just need "is round N due, and hasn't it been played yet".
function isCupCheckpointPending(stateLike, matchdayNum) {
  const idx = US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(matchdayNum);
  if (idx === -1) return false;
  if (stateLike.usOpenCup?.done) return false;
  const playedSoFar = stateLike.usOpenCup?.rounds?.length ?? 0;
  return playedSoFar === idx;
}

const LATER_CUP_ROUND_LABELS = ["Round of 32", "Round of 16", "Quarterfinal", "Round of 8", "Semifinal", "Final"];

function cupRoundLabel(roundIndex) {
  if (roundIndex === 0) return "Round 1";
  if (roundIndex === 1) return "Round 2";
  return LATER_CUP_ROUND_LABELS[Math.min(roundIndex - 2, LATER_CUP_ROUND_LABELS.length - 1)];
}

// Builds the entrant pool for the next round without resolving anything —
// shared by the preview draw and the actual play-the-round path.
function computeCupRoundPool(progress, tiers, qualifiers) {
  const wrap = (club, tierIdx) => ({ club, tierIdx });
  const roundIndex = progress ? progress.rounds.length : 0;
  const findClubAnywhere = (id) => {
    for (let ti = 0; ti < tiers.length; ti++) {
      const c = tiers[ti].clubs.find((cl) => cl.id === id);
      if (c) return wrap(c, ti);
    }
    return null;
  };
  if (roundIndex === 0) {
    return tiers[3].clubs.map((c) => wrap(c, 3)); // all USL2
  } else if (roundIndex === 1) {
    const usl1Entrants = tiers[2].clubs.map((c) => wrap(c, 2));
    const uslcTop16Ids = qualifiers?.uslcTop16 ?? computeTable(tiers[1]).slice(0, 16).map((r) => r.clubId);
    const top16UslcEntrants = uslcTop16Ids.map(findClubAnywhere).filter(Boolean);
    return [...progress.pool, ...usl1Entrants, ...top16UslcEntrants];
  } else if (roundIndex === 2) {
    const mlsBottom16Ids = qualifiers?.mlsBottom16 ?? computeTable(tiers[0]).slice(-16).map((r) => r.clubId);
    const bottom16MlsEntrants = mlsBottom16Ids.map(findClubAnywhere).filter(Boolean);
    return [...progress.pool, ...bottom16MlsEntrants];
  }
  return progress.pool;
}

// Draws (but does not play) the next round — a stable pairing that can be
// shown as "who you're about to play" before the match actually happens.
// Store the result and reuse it when actually resolving, since drawing
// again would shuffle to a different pairing.
function drawNextUsOpenCupRound(progress, tiers, qualifiers) {
  const pool = computeCupRoundPool(progress, tiers, qualifiers);
  const { pairs, byeEntrant } = drawCupPairs(pool);
  return { roundIndex: progress ? progress.rounds.length : 0, pairs, byeEntrant };
}

// Plays exactly the next round of the US Open Cup and returns updated
// progress. `progress` is null/undefined before Round 1. `qualifiers` is
// last season's final standings ({ uslcTop16, mlsBottom16 } club ID
// arrays) — real Open Cup qualification is based on the PREVIOUS season,
// not whatever's in progress this year. In Season 1 there is no previous
// season, so this falls back to current standings just that one time.
// `preDrawn`, if provided (from drawNextUsOpenCupRound), is resolved
// as-is instead of drawing a fresh pairing — keeps the previewed
// opponent consistent with what actually gets played.
function playNextUsOpenCupRound(progress, tiers, qualifiers, preDrawn) {
  const matchday = 9999; // sentinel — distinguishes cup matches from any real league matchday for card/injury logic
  const roundIndex = progress ? progress.rounds.length : 0;

  let result;
  if (preDrawn && preDrawn.roundIndex === roundIndex) {
    const matches = resolveCupPairs(preDrawn.pairs, matchday);
    const advancing = preDrawn.byeEntrant ? [...matches.map((m) => m.winnerEntrant), preDrawn.byeEntrant] : matches.map((m) => m.winnerEntrant);
    result = { matches, byeEntrant: preDrawn.byeEntrant, advancing };
  } else {
    const pool = computeCupRoundPool(progress, tiers, qualifiers);
    result = playCupRound(pool, matchday);
  }

  const roundGiantKillers = result.matches.filter((m) => m.isUpset).map((m) => ({ clubId: m.winnerEntrant.club.id, clubName: m.winnerEntrant.club.name }));
  const newRound = { label: cupRoundLabel(roundIndex), ...result };
  const rounds = [...(progress?.rounds || []), newRound];
  const giantKillerBonuses = [...(progress?.giantKillerBonuses || []), ...roundGiantKillers];

  if (result.advancing.length === 1) {
    const finalMatch = newRound.matches[0];
    return {
      rounds, giantKillerBonuses, pool: result.advancing, done: true,
      champion: finalMatch.winnerEntrant, runnerUp: finalMatch.loserEntrant,
    };
  }
  return { rounds, giantKillerBonuses, pool: result.advancing, done: false, champion: null, runnerUp: null };
}

// Resolves exactly one cup round in place against a live `next` draft:
// updates next.usOpenCup and pays out prize money the moment it's earned.
// Returns the newly-played round (for recap purposes). Shared by the
// manual "Play This Round" button and the bulk Sim Season / Sim to
// Window auto-resolution.
function resolveCupRoundInPlace(next) {
  const preDrawn = next.usOpenCup?.pendingDraw;
  const progress = playNextUsOpenCupRound(next.usOpenCup, next.tiers, next.usOpenCupQualifiers, preDrawn);
  const allClubs = next.tiers.flatMap((t) => t.clubs);
  const payOut = (clubId, amount) => {
    const c = allClubs.find((cl) => cl.id === clubId);
    if (c) c.budget += amount;
  };
  const newRound = progress.rounds[progress.rounds.length - 1];
  newRound.matches.forEach((m) => { if (m.isUpset) payOut(m.winnerEntrant.club.id, US_OPEN_CUP_GIANT_KILLER_BONUS); });
  if (progress.done) {
    payOut(progress.champion.club.id, US_OPEN_CUP_CHAMPION_PRIZE);
    payOut(progress.runnerUp.club.id, US_OPEN_CUP_RUNNERUP_PRIZE);
  }
  next.usOpenCup = { ...progress, pendingDraw: null };
  return newRound;
}

/* ============================================================
   BOARD PRESSURE — Executive mode only
   ============================================================ */

// Higher-reputation clubs get more demanding objectives, same way a
// legacy contender's board expects more than a newly-promoted club's does.
// Reputation bands don't line up the same way across tiers though — MLS
// reputations cluster ~66-87 while USLC sits ~36-50, so an absolute
// threshold (e.g. reputation >= 75) makes almost every MLS club look like
// a title contender while almost no USLC club ever does. Rank the club's
// reputation against its own tier-mates instead, so "title expectations"
// means "one of the best in this tier" everywhere, not "above a fixed number".
function generateBoardObjective(reputation, tierIdx, tierClubs) {
  const tierSize = tierClubs.length;
  const sorted = [...tierClubs.map((c) => c.reputation)].sort((a, b) => a - b);
  const rankBelowOrEqual = sorted.filter((r) => r <= reputation).length;
  const percentile = tierSize > 0 ? rankBelowOrEqual / tierSize : 0.5;

  if (percentile >= 0.85) {
    return { type: "title", description: `Win the ${TIER_META[tierIdx].name} title`, targetPosition: 1 };
  }
  if (percentile >= 0.6) {
    return { type: "top_half", description: "Finish in the top half of the table", targetPosition: Math.ceil(tierSize / 2) };
  }
  if (percentile >= 0.3) {
    return { type: "mid_table", description: "Finish mid-table, clear of any relegation trouble", targetPosition: tierSize - PROMOTE_RELEGATE_COUNT - 2 };
  }
  return { type: "avoid_relegation", description: "Avoid relegation", targetPosition: tierSize - PROMOTE_RELEGATE_COUNT };
}

function boardHappinessDelta(objective, finishPosition, relegated, promoted, budget) {
  let delta = 0;
  if (objective) {
    const met = finishPosition <= objective.targetPosition;
    delta += met ? 12 : -15;
  }
  if (relegated) delta -= 25;
  if (promoted) delta += 15;
  if (budget < 0) delta -= 10;
  return delta;
}

const SACK_THRESHOLD = 10;
const MAX_DESIGNATED_PLAYERS = 3;

// Designated Players' real wages don't count against effective payroll —
// mirrors how real MLS DP salaries are mostly exempt from the roster budget.
// Everyone else's wage counts normally.
function effectivePayroll(squad, designatedPlayerIds) {
  const dpSet = new Set(designatedPlayerIds || []);
  return squad.reduce((s, p) => s + (dpSet.has(p.id) ? Math.min(p.wage, 200_000) : p.wage), 0);
}

// A real salary cap for MLS (Executive mode only, where DPs are enabled) —
// without this, Designated Player status was previously a pure freebie:
// it discounted a star's cap hit with nothing forcing anyone over budget in
// the first place. Now non-DP wages have to fit under this number; DPs are
// the ONLY way to exceed it, same as in real MLS. This applies to buying
// and renewing — an existing squad that's already over (e.g. after a wage
// bump elsewhere) isn't retroactively broken, but new spending is gated.
const MLS_SALARY_CAP = 6_000_000;

// A marquee DP signing raises what people expect of the club, same as a big
// splashy transfer in real life — reputation only ever ratchets UP from
// this, never down, so cutting a DP later isn't retroactively punished,
// it just stops earning the ongoing perks below.
const DP_REPUTATION_BUMP = 3;

// Playing alongside a genuine star lifts a team's confidence a little,
// separate from and on top of the captain's leadership bonus — capped so
// it stays a nice-to-have, not a way to trivialize match strength.
const DP_XI_AURA_PER_PLAYER = 0.015;
const DP_XI_AURA_CAP = 0.05;

// Real Designated Players sell tickets and jerseys — a flat per-season
// revenue bump scaled to the DP's quality, on top of whatever prize money
// or event bonuses are already in play.
const DP_REVENUE_PER_OVERALL = 15_000;

function dpRevenueForClub(club) {
  const dpSet = new Set(club.designatedPlayerIds || []);
  if (dpSet.size === 0) return 0;
  return club.squad.filter((p) => dpSet.has(p.id)).reduce((s, p) => s + p.overall * DP_REVENUE_PER_OVERALL, 0);
}

// Computes everything playoff- and promotion-related from the CURRENT
// (pre-rollover) standings — callable on its own once the regular season
// ends, so the result can be displayed as a real postseason before the
// player commits to rolling over. rolloverSeason() calls this itself if it
// wasn't given a precomputed result, so behavior is identical either way.
function computeSeasonPlayoffs(tiers, userClubId, difficulty) {
  const tables = tiers.map(computeTable);
  const playoffMatchday = 9999; // sentinel — playoffs happen after the season, past any lingering injury/suspension cutoffs
  const promotionPlayoffs = [];
  const movementByBoundary = [];

  for (let i = 0; i < tiers.length - 1; i++) {
    const upperTable = tables[i];
    const lowerTable = tables[i + 1];
    const relegated = upperTable.slice(-PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);
    let promoted;
    if (i === 0) {
      // MLS <-> USL Championship: no real-world promotion into MLS, so this
      // boundary stays simple table-based movement, same as always.
      promoted = lowerTable.slice(0, PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);
    } else {
      // Top 2 promote automatically; the last spot is decided by a 4-team
      // playoff among 3rd-6th place, like most real pro/rel leagues do it.
      const playoff = runPromotionPlayoff(lowerTable, tiers[i + 1].clubs, playoffMatchday);
      promoted = [...playoff.autoPromoted, playoff.playoffPromoted];
      promotionPlayoffs.push({ tierIdx: i + 1, ...playoff });
    }
    movementByBoundary.push({ upperTierIdx: i, promoted, relegated });
  }

  // MLS Cup Playoffs & USL Championship playoff always happen — the sporting
  // outcome (who wins the Cup) isn't an economic feature, so it shouldn't be
  // tied to difficulty mode. Only the real-dollar bonuses tied to results
  // are Pro/Executive-exclusive (handled separately, in rolloverSeason).
  const mlsPlayoffResult = runMlsPlayoffs(tables[0], tiers[0].clubs, playoffMatchday);
  // USL Championship runs its own real playoff too — top 8, single
  // elimination, no conferences. Crowns the USL Cup separately from the
  // Players' Shield (the regular-season table topper).
  const uslcPlayoffResult = runFlatPlayoffBracket(tables[1], tiers[1].clubs, playoffMatchday, 8);

  return { tables, movementByBoundary, promotionPlayoffs, mlsPlayoffResult, uslcPlayoffResult };
}

// End-of-season awards for a tier — Golden Boot, Best Young Player, and a
// simple Team of the Season (best-rated player at each slot). Computed
// from THIS season's data (goal tallies, current ratings) before rollover
// regrows/resets anything.
function computeSeasonAwards(tier) {
  const allPlayers = tier.clubs.flatMap((c) => c.squad.map((p) => ({ ...p, clubName: c.name })));
  if (!allPlayers.length) return null;
  const scorers = allPlayers.filter((p) => (p.seasonGoals || 0) > 0);
  const topScorer = scorers.length ? [...scorers].sort((a, b) => b.seasonGoals - a.seasonGoals)[0] : null;

  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  allPlayers.forEach((p) => { (byPos[p.position] || byPos.MID).push(p); });
  const top = (arr, n) => [...arr].sort((a, b) => b.overall - a.overall).slice(0, n);
  const teamOfSeason = { GK: top(byPos.GK, 1), DEF: top(byPos.DEF, 4), MID: top(byPos.MID, 4), FWD: top(byPos.FWD, 2) };

  const youngPlayers = allPlayers.filter((p) => p.age <= 21);
  const bestYoungPlayer = youngPlayers.length ? [...youngPlayers].sort((a, b) => b.overall - a.overall)[0] : null;

  return { topScorer, teamOfSeason, bestYoungPlayer };
}

function rolloverSeason(tiers, userClubId, prizePools, difficulty, precomputedPlayoffs) {
  const { tables, movementByBoundary, promotionPlayoffs, mlsPlayoffResult, uslcPlayoffResult } =
    precomputedPlayoffs || computeSeasonPlayoffs(tiers, userClubId, difficulty);
  const userTierIdxForAwards = tiers.findIndex((t) => t.clubs.some((c) => c.id === userClubId));
  const seasonAwards = userTierIdxForAwards !== -1 ? computeSeasonAwards(tiers[userTierIdxForAwards]) : null;
  const newTierClubIds = tiers.map((t) => t.clubs.map((c) => c.id));
  const clubsById = {};
  tiers.forEach((t) => t.clubs.forEach((c) => (clubsById[c.id] = c)));

  const events = []; // {clubName, from, to, type: 'promoted'|'relegated'|'champion'}

  for (let i = 0; i < tiers.length; i++) {
    const champion = clubsById[tables[i][0].clubId];
    events.push({ clubId: champion.id, clubName: champion.name, tier: i, type: "champion" });
  }

  movementByBoundary.forEach(({ upperTierIdx: i, promoted, relegated }) => {
    newTierClubIds[i] = newTierClubIds[i].filter((id) => !relegated.includes(id)).concat(promoted);
    newTierClubIds[i + 1] = newTierClubIds[i + 1].filter((id) => !promoted.includes(id)).concat(relegated);

    relegated.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i, to: i + 1, type: "relegated" }));
    promoted.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i + 1, to: i, type: "promoted" }));
  });

  // A player's wage should only ever move when their contract actually
  // renews (an explicit action, whether the user's own renewal or the
  // AI's auto-renewal logic below) — never automatically just because
  // their club got promoted or relegated. The only thing rebased here is
  // a brand-new player's still-crude placeholder wage, corrected once to
  // something tier-realistic the first time they pass through a rollover.

  // Prize money: on Rookie, distributed by final standing from a per-tier
  // pool that shrinks a little every season (simple, no real-world figures
  // needed). On Pro/Executive, real-world-calibrated season bonuses apply
  // instead — Shield-style money for now; once playoffs exist, MLS Cup /
  // conference / playoff-qualifier bonuses layer in on top of this.
  const eventBonusesOn = DIFFICULTY_MODES[difficulty]?.eventBonuses;
  const prizeAmountsByTier = tables.map((table, i) =>
    eventBonusesOn ? computeEventBonuses(table, i) : distributePrizeMoney(table, prizePools[i])
  );
  const newPrizePools = decayPrizePools(prizePools);
  let userPrize = 0;
  prizeAmountsByTier.forEach((amounts) => { if (amounts[userClubId] != null) userPrize = amounts[userClubId]; });

  // Contracts: age and grow/decline every player, decrement contracts, refresh
  // fitness/injuries/suspensions. Also checks retirement (34+, climbing odds,
  // forced by 41). AI clubs auto-replace expired/retired contracts to keep
  // the world populated. The user's own club does NOT get auto-replaced —
  // a contract that reaches 0, or a player who retires, leaves as-is and the
  // slot stays open, so renewing ahead of time is a real decision.
  // Reputation was previously frozen at world-creation — a club's board
  // expectations never budged no matter how the club actually performed or
  // how its squad evolved. Track each club's finishing position this season
  // so reputation can drift with results, not just sit fixed forever.
  const positionById = {};
  const tierSizeById = {};
  tables.forEach((table) => {
    table.forEach((row, idx) => {
      positionById[row.clubId] = idx + 1;
      tierSizeById[row.clubId] = table.length;
    });
  });

  let userRetirements = [];
  let userDisqualificationNotice = null;
  let userDpRevenue = 0;
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
          seasonGoals: 0,
        };
      });
      const retiring = squad.filter((p) => Math.random() < retirementChance(p.age));
      if (isUser && retiring.length) userRetirements = userRetirements.concat(retiring.map((p) => p.name));
      const retiredIds = new Set(retiring.map((p) => p.id));
      squad = squad.filter((p) => !retiredIds.has(p.id));
      if (isUser) {
        squad = squad.filter((p) => p.contractYearsLeft > 0);
        // A retired or expired-contract player who was a Designated Player
        // needs that slot actually freed up — otherwise it stays occupied
        // forever by someone no longer even on the roster.
        if (club.designatedPlayerIds?.length) {
          const stillOnRoster = new Set(squad.map((p) => p.id));
          club.designatedPlayerIds = club.designatedPlayerIds.filter((id) => stillOnRoster.has(id));
        }
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
          // MLS occasionally lands a marquee free-agent signing instead of
          // just generating another academy-tier prospect — without this,
          // the pool of genuinely elite (85+) players only ever shrinks as
          // real stars age out, since replacements otherwise cluster near
          // the tier's base rating.
          if (i === 0 && Math.random() < 0.06) {
            return makePlayer(p.position, baseRating + randInt(18, 30));
          }
          return makePlayer(p.position, baseRating + randInt(-8, 8));
        });
        // top back up to a full squad if retirements left an AI club short
        while (squad.length < MIN_SQUAD_SIZE) {
          squad.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), baseRating + randInt(-8, 8)));
        }
      }
      const prize = prizeAmountsByTier[i][id] ?? 0;
      const youthPlayers = (club.youthPlayers || []).map((p) => growYouthProspect(p, club.academyStars || 0));
      // A fresh draft pick, academy promotion, or new signing still on a
      // crude placeholder wage gets corrected to something tier-realistic
      // once, here. Anyone who already has a real wage keeps it exactly as
      // is — even through a promotion or relegation — until their
      // contract actually comes up for renewal.
      squad = squad.map((p) => (
        !p.wageSet ? { ...p, wage: computeRealisticWage(p.overall, p.age, i), wageSet: true } : p
      ));
      const payroll = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? effectivePayroll(squad, club.designatedPlayerIds) : 0;

      // Reputation drifts each season: mostly it tracks the squad's evolving
      // quality (transfers in/out, aging, academy graduates), but a strong
      // or weak finish nudges it a bit further in that direction too — a
      // club overachieving its target builds prestige beyond just its
      // player ratings, same as an underachieving one loses some. Blended
      // rather than replaced outright so a single freak season can't swing
      // it wildly; a club's history still has weight.
      const squadReputation = computeReputation(squad);
      const finishPosition = positionById[id];
      const finishTierSize = tierSizeById[id];
      let performanceNudge = 0;
      if (finishPosition != null && finishTierSize != null) {
        if (finishPosition === 1) performanceNudge = 2;
        else if (finishPosition <= 3) performanceNudge = 1;
        else if (finishPosition >= finishTierSize - 2) performanceNudge = -1;
      }
      const reputation = clamp(Math.round(club.reputation * 0.75 + squadReputation * 0.25) + performanceNudge, 20, 95);
      // Designated Players sell tickets and jerseys — a flat per-season
      // revenue bump scaled to their quality, same difficulty gate as the
      // rest of the wage/prize economics.
      const dpRevenue = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? dpRevenueForClub(club) : 0;
      if (id === userClubId) userDpRevenue = dpRevenue;

      const rolledClub = {
        ...club,
        squad,
        reputation,
        budget: club.budget + prize + ownershipDepositFor(i, difficulty) + dpRevenue - payroll,
        academyEligible: !!club.academyEligible || i <= 1,
        youthPlayers,
        tryoutCandidates: [], // last window's tryout candidates don't carry over — sign or lose them
      };
      const { club: checkedClub, notice } = applyDisqualificationCheck(rolledClub, i);
      if (notice && id === userClubId) userDisqualificationNotice = notice;
      return checkedClub;
    });
    return { id: t.id, name: t.name, clubs, fixtures: generateRoundRobin(clubs.map((c) => c.id)) };
  });

  const windowResult = runTransferWindow(newTiers, userClubId);
  const userDraftPicks = runDraft(tables, newTiers, userClubId);

  // MLS Cup Playoffs payouts: champion/runner-up also banked their conference
  // championship bonus on the way there; every other team that made the
  // 18-team bracket gets a smaller qualifier bonus. Winners get paid
  // regardless of difficulty mode — this money is separate from the
  // per-win/wage economics that Pro/Executive add.
  let userMlsPlayoff = null;
  if (mlsPlayoffResult) {
    const mlsClubsAfter = newTiers[0].clubs;
    const payOut = (clubId, amount) => {
      const c = mlsClubsAfter.find((cl) => cl.id === clubId);
      if (c) c.budget += amount;
    };
    payOut(mlsPlayoffResult.champion.id, 300_000 + 35_000);
    payOut(mlsPlayoffResult.runnerUp.id, 100_000 + 35_000);
    mlsPlayoffResult.otherQualifiers.forEach((id) => payOut(id, 20_000));

    if (userClubId === mlsPlayoffResult.champion.id) userMlsPlayoff = { result: "champion", amount: 335_000 };
    else if (userClubId === mlsPlayoffResult.runnerUp.id) userMlsPlayoff = { result: "runner-up", amount: 135_000 };
    else if (mlsPlayoffResult.otherQualifiers.includes(userClubId)) userMlsPlayoff = { result: "qualifier", amount: 20_000 };
  }

  // USL Championship's own playoff (real, separate from the promotion
  // playoff below it): champion/runner-up money, small consolation for the
  // rest of the bracket. Paid out regardless of difficulty, same as MLS.
  let userUslcPlayoff = null;
  if (uslcPlayoffResult) {
    const uslcClubsAfter = newTiers[1].clubs;
    const payOutUslc = (clubId, amount) => {
      const c = uslcClubsAfter.find((cl) => cl.id === clubId);
      if (c) c.budget += amount;
    };
    const otherUslcQualifiers = uslcPlayoffResult.qualifiers.filter(
      (id) => id !== uslcPlayoffResult.champion.id && id !== uslcPlayoffResult.runnerUp.id
    );
    payOutUslc(uslcPlayoffResult.champion.id, 40_000);
    payOutUslc(uslcPlayoffResult.runnerUp.id, 15_000);
    otherUslcQualifiers.forEach((id) => payOutUslc(id, 5_000));

    if (userClubId === uslcPlayoffResult.champion.id) userUslcPlayoff = { result: "champion", amount: 40_000 };
    else if (userClubId === uslcPlayoffResult.runnerUp.id) userUslcPlayoff = { result: "runner-up", amount: 15_000 };
    else if (otherUslcQualifiers.includes(userClubId)) userUslcPlayoff = { result: "qualifier", amount: 5_000 };
  }

  const userClubAfter = newTiers.flatMap((t) => t.clubs).find((c) => c.id === userClubId);
  const userPayroll = DIFFICULTY_MODES[difficulty]?.wagesDeducted && userClubAfter ? effectivePayroll(userClubAfter.squad, userClubAfter.designatedPlayerIds) : 0;
  // Draft additions are the one pure-growth step with no natural release —
  // cap every club (except the user's, whose picks aren't applied until
  // they choose Keep) so the world can't balloon season over season.
  newTiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id !== userClubId) c.squad = trimSquad(c.squad);
    });
  });

  const userOriginalTierIdx = tiers.findIndex((t) => t.clubs.some((c) => c.id === userClubId));
  const userPromotionPlayoff = promotionPlayoffs.find((pp) => pp.tierIdx === userOriginalTierIdx);

  return {
    newTiers, events, tables, windowResult, newPrizePools, userPrize, userRetirements, userDraftPicks, userPayroll,
    mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, promotionPlayoffs, userPromotionPlayoff,
    userDisqualificationNotice, userDpRevenue, seasonAwards,
  };
}

/* ============================================================
   TRANSFER MARKET (windowed — mirrors real preseason/midseason windows)
   ============================================================ */

const MID_SEASON_WINDOW_MATCHDAY = 10; // window opens once matchday 9 is complete

function marketValue(p) {
  // meaningfully gentler curve than before — a decent rotation player (65-70
  // overall) should be a few hundred thousand to ~$2M, a genuine good starter
  // (74-ish) a few million, and only real elite talent (85+) climbs into
  // eight figures, capped around $55-60M for the very best.
  const base = 140 * Math.pow(1.145, p.overall);
  let ageFactor = p.age <= 23 ? 1.5 : p.age <= 26 ? 1.2 : p.age <= 29 ? 1.0 : p.age <= 32 ? 0.55 : 0.25;
  // true megastars keep real commercial/marquee value even late in their
  // career — an aging legend doesn't collapse to bench-player money
  if (p.overall >= 85) ageFactor = Math.max(ageFactor, 0.6);
  const potFactor = 1 + (p.potential - p.overall) * 0.04;
  // form: we don't track a separate running form stat, but morale already
  // reflects recent results for this exact player, so it doubles as one
  const formFactor = 0.85 + (p.morale / 100) * 0.3;
  const raw = base * ageFactor * potFactor * formFactor;
  return Math.min(58_000_000, Math.round(raw / 1000) * 1000);
}

// Renewals aren't free or unlimited: a very unhappy player just says no, a
// merely unhappy one will only re-sign for a bigger bonus, and it always
// comes out of the budget.
function renewalOutcome(p, budget) {
  if (p.morale < 20) {
    return { accepted: false, reason: "too unhappy to even discuss an extension right now" };
  }
  const baseCost = Math.round(marketValue(p) * 0.06);
  let moraleFactor;
  if (p.morale >= 70) moraleFactor = 1.0;
  else if (p.morale >= 50) moraleFactor = 1.2;
  else if (p.morale >= 30) moraleFactor = 1.6;
  else moraleFactor = 2.0;
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
      // The user's own listed players used to be skipped here entirely —
      // AI would only ever consider buying them through the much slower
      // in-season 8% roll, which is why listings could sit for 3-4 seasons.
      // They're included now, and weighted higher: a real market moves
      // faster on a known-available listing during an actual transfer
      // window than it does on a random Tuesday mid-season.
      const isUserSeller = seller.id === userClubId;
      const listedNow = seller.squad.filter((p) => p.transferListed);
      listedNow.forEach((p) => {
        // A player auto-listed from unhappiness (transferRequested) isn't
        // something the user necessarily chose to sell — that's still the
        // user's call ("play them more or let them go"), so it moves at a
        // normal market pace instead of the fast rate meant for a
        // deliberate voluntary listing. Otherwise several unhappy players
        // could get sold off in a single bulk sim with no real say from
        // the user, suddenly gutting the squad below the minimum.
        const buyChance = isUserSeller ? (p.transferRequested ? 0.2 : 0.6) : 0.35;
        if (Math.random() >= buyChance) return;
        const buyers = t.clubs.filter((c) => c.id !== seller.id && c.id !== userClubId && c.budget >= p.askingPrice && c.squad.length < MAX_SQUAD_SIZE);
        if (!buyers.length) return;
        const buyer = choice(buyers);
        buyer.budget -= p.askingPrice;
        seller.budget += p.askingPrice;
        p.transferListed = false;
        p.askingPrice = null;
        p.benchStreak = 0;
        p.transferRequested = false;
        seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
        if (seller.designatedPlayerIds?.includes(p.id)) {
          seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== p.id);
        }
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

function CountrySelectScreen({ onChoose }) {
  const countries = [
    {
      key: "usa",
      flag: "🇺🇸",
      title: "United States",
      tagline: "MLS · USL Championship · USL League One · USL League Two",
      points: ["Fully playable — real rosters, real rules", "Designated Players, SuperDraft, US Open Cup"],
      ready: true,
    },
    {
      key: "england",
      flag: "🏴",
      title: "England",
      tagline: "Premier League · Championship · League One · League Two",
      points: ["In progress — real rosters and rules are still being researched", "Selecting this shows what's built so far, not a finished pyramid yet"],
      ready: false,
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...display, fontSize: 44, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 14, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Choose your pyramid
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {countries.map((c) => (
            <button
              key={c.key}
              onClick={() => onChoose(c.key)}
              style={{
                textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}55`, borderRadius: 12,
                padding: 20, cursor: "pointer", color: PALETTE.parchment, display: "flex", flexDirection: "column", gap: 10,
                opacity: c.ready ? 1 : 0.85,
              }}
            >
              <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold, display: "flex", alignItems: "center", gap: 8 }}>
                {c.flag} {c.title}
                {!c.ready && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: PALETTE.crimson, color: "#fff", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em" }}>
                    IN PROGRESS
                  </span>
                )}
              </div>
              <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>{c.tagline}</div>
              <div style={{ height: 1, background: `${PALETTE.gold}33`, margin: "4px 0" }} />
              {c.points.map((pt, i) => (
                <div key={i} style={{ fontSize: 13, ...serif, opacity: 0.9 }}>{pt}</div>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnglandComingSoonScreen({ onBack, onTryTestMode }) {
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ ...display, fontSize: 32, fontWeight: 700, color: PALETTE.gold, marginBottom: 12 }}>
          🏴 England
        </div>
        <div style={{ color: PALETTE.parchment, fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
          The full Championship/League One/League Two pyramid isn't built yet — but all 20 real Premier League clubs and their researched rosters are ready to test.
        </div>
        <div style={{ color: PALETTE.parchment, fontSize: 15, lineHeight: 1.6, marginBottom: 24, opacity: 0.8 }}>
          No promotion/relegation, no FA Cup, no transfers yet — just real clubs, real ratings, and match simulation, standalone for now.
        </div>
        <button
          onClick={onTryTestMode}
          style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 14, fontWeight: 700, cursor: "pointer", ...display, marginBottom: 12, width: "100%" }}
        >
          Try Premier League Test Mode →
        </button>
        <button
          onClick={onBack}
          style={{ padding: "12px 24px", borderRadius: 8, border: `1px solid ${PALETTE.gold}`, background: "none", color: PALETTE.gold, fontSize: 14, fontWeight: 600, cursor: "pointer", ...display, width: "100%" }}
        >
          ← Back to pyramid select
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ENGLAND TEST MODE — standalone, minimal harness for trying the
// researched Premier League data. Deliberately separate from the main
// Dashboard: no promotion/relegation (nothing to move to/from yet), no
// cups, no DP/board mechanics. Just real clubs, real ratings, and match
// simulation, so the data itself can be evaluated before building the
// full pyramid around it.
function buildEnglandTestWorld() {
  const clubs = PREMIER_LEAGUE_CLUBS.map((name) => {
    const slug = Object.keys(ENGLAND_ROSTERS).find((k) => ENGLAND_ROSTERS[k].name === name);
    const team = ENGLAND_ROSTERS[slug];
    return makeClub({
      name: team.name,
      squad: team.players.map(realPlayerToRuntime),
      isReal: true,
      budget: randInt(50_000_000, 150_000_000),
      academyEligible: false,
    });
  });
  const tier = { id: 0, name: "Premier League", clubs, fixtures: [] };
  tier.fixtures = generateRoundRobin(clubs.map((c) => c.id));
  return tier;
}

function EnglandTestScreen({ onBack }) {
  const [tier, setTier] = useState(() => buildEnglandTestWorld());
  const [userClubId, setUserClubId] = useState(null);
  const [tab, setTab] = useState("table");
  const [recap, setRecap] = useState(null);

  if (!userClubId) {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px 80px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}>
            ← Back
          </button>
          <div style={{ ...display, fontSize: 28, fontWeight: 700, color: PALETTE.gold, marginBottom: 20, textAlign: "center" }}>
            Pick a Premier League Club
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {tier.clubs.map((c) => {
              const avgOvr = Math.round(c.squad.reduce((s, p) => s + p.overall, 0) / c.squad.length);
              return (
                <button
                  key={c.id}
                  onClick={() => setUserClubId(c.id)}
                  style={{ textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}55`, borderRadius: 8, padding: 12, cursor: "pointer", color: PALETTE.parchment }}
                >
                  <div style={{ ...display, fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, ...mono }}>Avg {avgOvr} OVR</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const userClub = tier.clubs.find((c) => c.id === userClubId);
  const table = computeTable(tier);
  const currentMatchday = tier.fixtures.some((f) => !f.played)
    ? Math.min(...tier.fixtures.filter((f) => !f.played).map((f) => f.matchday))
    : null;

  const handleSimMatchday = () => {
    if (currentMatchday === null) return;
    const next = { ...tier, clubs: tier.clubs, fixtures: [...tier.fixtures] };
    const matches = [];
    next.fixtures.filter((f) => f.matchday === currentMatchday).forEach((fx) => {
      const home = next.clubs.find((c) => c.id === fx.homeClubId);
      const away = next.clubs.find((c) => c.id === fx.awayClubId);
      const result = simulateMatch(fx, home, away, currentMatchday, "pro");
      matches.push(result);
    });
    setTier({ ...next });
    setRecap({ matchday: currentMatchday, matches });
  };

  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  const nextFixture = userFixtures.find((f) => !f.played);

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 12 }}>
          ← Exit test mode
        </button>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold, marginBottom: 4 }}>{userClub.name}</div>
        <div style={{ color: PALETTE.parchment, fontSize: 12, opacity: 0.7, marginBottom: 16, ...mono }}>
          {currentMatchday !== null ? `Matchday ${currentMatchday}` : "Season complete"}
          {nextFixture && ` — next: ${nextFixture.homeClubId === userClubId ? "vs" : "@"} ${tier.clubs.find((c) => c.id === (nextFixture.homeClubId === userClubId ? nextFixture.awayClubId : nextFixture.homeClubId)).name}`}
        </div>
        <button
          onClick={handleSimMatchday}
          disabled={currentMatchday === null}
          style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 13, fontWeight: 700, cursor: currentMatchday === null ? "default" : "pointer", opacity: currentMatchday === null ? 0.5 : 1, ...display, marginBottom: 20 }}
        >
          Sim Matchday
        </button>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["table", "squad"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${PALETTE.gold}`, background: tab === t ? PALETTE.gold : "none", color: tab === t ? PALETTE.ink : PALETTE.gold, fontSize: 12, fontWeight: 600, cursor: "pointer", ...display, textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>
        {tab === "table" && (
          <div style={{ background: PALETTE.pitch, borderRadius: 8, overflow: "hidden" }}>
            {table.map((row, i) => {
              const club = tier.clubs.find((c) => c.id === row.clubId);
              const isUser = row.clubId === userClubId;
              return (
                <div key={row.clubId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", background: isUser ? `${PALETTE.gold}33` : i % 2 ? "#00000022" : "none", color: PALETTE.parchment, fontSize: 12.5, ...serif }}>
                  <span>{i + 1}. {club.name}</span>
                  <span style={{ ...mono }}>{row.points} pts ({row.played}p)</span>
                </div>
              );
            })}
          </div>
        )}
        {tab === "squad" && (
          <div style={{ background: PALETTE.pitch, borderRadius: 8, padding: 8 }}>
            {[...userClub.squad].sort((a, b) => b.overall - a.overall).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", color: PALETTE.parchment, fontSize: 12.5, ...serif }}>
                <span>{p.name} <span style={{ opacity: 0.6, ...mono, fontSize: 10.5 }}>{p.position}</span></span>
                <span style={{ ...mono, fontWeight: 700 }}>{p.overall}</span>
              </div>
            ))}
          </div>
        )}
        {recap && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }} onClick={() => setRecap(null)}>
            <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 20, maxHeight: "70vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...display, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>Matchday {recap.matchday}</div>
              {recap.matches.map((m, i) => (
                <div key={i} style={{ ...serif, fontSize: 13, padding: "4px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                  {m.homeClub} <span style={{ ...mono }}>{m.homeScore}-{m.awayScore}</span> {m.awayClub}
                </div>
              ))}
              <button onClick={() => setRecap(null)} style={{ marginTop: 12, width: "100%", padding: "8px 0", borderRadius: 6, border: "none", background: PALETTE.ink, color: "#fff", cursor: "pointer", ...display }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DifficultySelectScreen({ onChoose, onBack }) {
  const modes = [
    {
      key: "rookie",
      title: "Rookie",
      tagline: "Learn the game",
      points: ["No payroll to manage", "Simple end-of-season prize money", "No board pressure — just play"],
    },
    {
      key: "pro",
      title: "Pro",
      tagline: "Run a real budget",
      points: ["Real wages, tier-scaled, paid every season", "Event-driven bonuses — per-win, shield, cup, playoffs", "Still no board looking over your shoulder"],
    },
    {
      key: "executive",
      title: "Executive",
      tagline: "The full front office",
      points: ["Everything in Pro, plus:", "Designated Players & a salary cap (MLS)", "Board objectives, sacking risk, and a career-long happiness score"],
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px 80px" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}
          >
            ← Back to pyramid select
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...display, fontSize: 44, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 14, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Choose your difficulty
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => onChoose(m.key)}
              style={{
                textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}55`, borderRadius: 12,
                padding: 20, cursor: "pointer", color: PALETTE.parchment, display: "flex", flexDirection: "column", gap: 10,
              }}
            >
              <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold }}>{m.title}</div>
              <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>{m.tagline}</div>
              <div style={{ height: 1, background: `${PALETTE.gold}33`, margin: "4px 0" }} />
              {m.points.map((pt, i) => (
                <div key={i} style={{ fontSize: 13, ...serif, opacity: 0.9 }}>{pt}</div>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubSelectScreen({ world, onPick, saveWasReset, difficulty, onBack }) {
  const [openTier, setOpenTier] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 20px 80px" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}
          >
            ← Back to difficulty select
          </button>
        )}
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
                    Funds: {formatMoney(ownershipDepositFor(meta.id, difficulty))}/season
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

function RolloverModal({ events, userClubId, seasonNumber, windowResult, userPrize, ownershipDeposit, userRetirements, userPayroll, mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, userPromotionPlayoff, boardNotice, usOpenCup, userUsOpenCup, userDpRevenue, seasonAwards, onContinue }) {
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
              {userChamp.tier === 0 ? "You won the Supporters' Shield!" : userChamp.tier === 1 ? "You won the Players' Shield!" : `You won the ${TIER_META[userChamp.tier].name} title!`}
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

        {userPayroll > 0 && (
          <div style={{ background: "#F0E4D8", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            🧾 Payroll for the season ahead: <strong>-${userPayroll.toLocaleString()}</strong> deducted from your budget.
          </div>
        )}

        {userDpRevenue > 0 && (
          <div style={{ background: "#E8F0E4", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            ⭐ Designated Player gate & jersey revenue: <strong>+${userDpRevenue.toLocaleString()}</strong> added to your budget.
          </div>
        )}

        {boardNotice && (
          <div style={{ background: "#E4D9C4", border: `1px solid ${PALETTE.bronze}`, borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 13.5, color: PALETTE.ink, whiteSpace: "pre-line" }}>
            🪑 {boardNotice}
          </div>
        )}

        {userMlsPlayoff && (
          <div style={{ background: PALETTE.gold, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userMlsPlayoff.result === "champion" ? "MLS Cup Champions!" : userMlsPlayoff.result === "runner-up" ? "MLS Cup runner-up" : "Made the MLS Cup Playoffs"} — ${userMlsPlayoff.amount.toLocaleString()} playoff bonus.
            </div>
          </div>
        )}

        {userUslcPlayoff && (
          <div style={{ background: PALETTE.silver, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userUslcPlayoff.result === "champion" ? "USL Cup Champions!" : userUslcPlayoff.result === "runner-up" ? "USL Cup runner-up" : "Made the USL Championship Playoffs"} — ${userUslcPlayoff.amount.toLocaleString()} playoff bonus.
            </div>
          </div>
        )}

        {userUsOpenCup && (
          <div style={{ background: "#D9C6E8", borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Star size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userUsOpenCup.result === "champion" ? "US Open Cup Champions!" : userUsOpenCup.result === "runner-up" ? "US Open Cup runner-up" : `Giant-killer run in the US Open Cup (${userUsOpenCup.giantKillerWins} upset win${userUsOpenCup.giantKillerWins === 1 ? "" : "s"})`} — earned earlier this season.
            </div>
          </div>
        )}

        {userPromotionPlayoff && (
          <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 16 }}>
            {userPromotionPlayoff.bracket
              ? "The last promotion spot in your division went through a 3rd-6th place playoff this season."
              : null}
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
          Champions & Cup Winners
        </div>
        {(() => {
          const rows = [];
          const addShieldOrChamp = (tierIdx, label) => {
            const c = champions.find((e) => e.tier === tierIdx);
            if (c) rows.push({ tierIdx, label, winner: c.clubName });
          };
          const addCupWinner = (label, result, tierIdx) => {
            if (!result) return;
            const championName = result.champion.club ? result.champion.club.name : result.champion.name;
            rows.push({ tierIdx, label, winner: championName });
          };
          addCupWinner("US Open Cup Winner", usOpenCup?.done ? usOpenCup : null, null);
          addShieldOrChamp(0, "Supporters' Shield");
          addCupWinner("MLS Cup Winner", mlsPlayoffResult, 0);
          addShieldOrChamp(1, "Players' Shield");
          addCupWinner("USL Cup Winner", uslcPlayoffResult, 1);
          addShieldOrChamp(2, `${TIER_META[2].name} Champion`);
          addShieldOrChamp(3, `${TIER_META[3].name} Champion`);

          if (rows.length === 0) return null;
          return (
            <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${PALETTE.parchmentDim}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", background: PALETTE.ink, color: PALETTE.parchment, ...display, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <div style={{ padding: "6px 8px" }}>League</div>
                <div style={{ padding: "6px 8px" }}>Award</div>
                <div style={{ padding: "6px 8px" }}>Winner</div>
              </div>
              {rows.map((r, i) => {
                const tint = r.tierIdx === null ? "#D9C6E822" : `${TIER_META[r.tierIdx].color}22`;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", background: tint, borderTop: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif, color: PALETTE.ink }}>
                    <div style={{ padding: "7px 8px", display: "flex", alignItems: "center" }}>
                      {r.tierIdx === null
                        ? <span style={{ background: PALETTE.gold, color: PALETTE.ink, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, ...display }}>CUP</span>
                        : <TierBadge tierId={r.tierIdx} />}
                    </div>
                    <div style={{ padding: "7px 8px", fontWeight: 600 }}>{r.label}</div>
                    <div style={{ padding: "7px 8px" }}>{r.winner}</div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {seasonAwards && (
          <>
            <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 20 }}>
              Season Awards
            </div>
            {seasonAwards.topScorer && (
              <div style={{ fontSize: 14, color: PALETTE.ink, marginBottom: 4, ...serif }}>
                ⚽ <strong>Golden Boot:</strong> {seasonAwards.topScorer.name} ({seasonAwards.topScorer.clubName}) — {seasonAwards.topScorer.seasonGoals} goals
              </div>
            )}
            {seasonAwards.bestYoungPlayer && (
              <div style={{ fontSize: 14, color: PALETTE.ink, marginBottom: 4, ...serif }}>
                🌟 <strong>Best Young Player:</strong> {seasonAwards.bestYoungPlayer.name} ({seasonAwards.bestYoungPlayer.clubName}, age {seasonAwards.bestYoungPlayer.age}) — {seasonAwards.bestYoungPlayer.overall} OVR
              </div>
            )}
            {seasonAwards.teamOfSeason && (
              <details style={{ marginTop: 6 }}>
                <summary style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, cursor: "pointer" }}>Team of the Season</summary>
                <div style={{ marginTop: 6 }}>
                  {["GK", "DEF", "MID", "FWD"].flatMap((pos) => seasonAwards.teamOfSeason[pos]).map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, ...serif, color: PALETTE.ink, padding: "3px 0" }}>
                      <span><span style={{ ...mono, color: PALETTE.inkSoft, marginRight: 8, fontSize: 11 }}>{p.position}</span>{p.name} ({p.clubName})</span>
                      <span style={{ ...mono, fontWeight: 700 }}>{p.overall}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}

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

function RivalryRecapModal({ recap, onClose }) {
  if (!recap) return null;
  const { homeClub, awayClub, homeScore, awayScore, userIsHome, difficulty } = recap;
  const userGoals = userIsHome ? homeScore : awayScore;
  const oppGoals = userIsHome ? awayScore : homeScore;
  const userWon = userGoals > oppGoals;
  const draw = userGoals === oppGoals;
  const eventBonusesOn = DIFFICULTY_MODES[difficulty]?.eventBonuses;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 24, border: `3px solid ${PALETTE.crimson}` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.crimson, display: "flex", alignItems: "center", gap: 8 }}>
            🔥 RIVALRY MATCH
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        <div style={{ ...display, fontSize: 18, fontWeight: 700, color: PALETTE.ink, textAlign: "center", margin: "14px 0" }}>
          {homeClub} <span style={{ ...mono }}>{homeScore} - {awayScore}</span> {awayClub}
        </div>
        <div style={{ ...serif, fontSize: 15, color: draw ? PALETTE.inkSoft : userWon ? "#2E7D32" : PALETTE.crimson, textAlign: "center", marginBottom: 8, fontWeight: 600 }}>
          {draw ? "A draw in a fixture like this — nobody's happy, nobody's thrilled." : userWon ? "Bragging rights are yours!" : "A tough one to take from your rivals."}
        </div>
        {userWon && (
          <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, textAlign: "center" }}>
            A small reputation bump for the win{eventBonusesOn ? ", plus a boost in gate revenue from the derby atmosphere." : "."}
          </div>
        )}
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 16, background: PALETTE.crimson, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function CupRecapModal({ recap, userClubId, onClose }) {
  if (!recap) return null;
  const { roundLabel, match } = recap;
  const { homeEntrant, awayEntrant, outcome, winnerEntrant, isUpset } = match;
  const { result, wentToPenalties } = outcome;
  const userWon = winnerEntrant.club.id === userClubId;
  const userEliminated = !userWon;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 20, fontWeight: 700, color: PALETTE.ink, display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={20} color={PALETTE.gold} /> US Open Cup — {roundLabel}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        <div style={{ padding: "12px 10px", borderRadius: 8, background: PALETTE.parchmentDim, border: `1px solid ${PALETTE.gold}`, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", columnGap: 8 }}>
            <div style={{ display: "flex", alignItems: "start", gap: 6, textAlign: "left" }}>
              <TierBadge tierId={homeEntrant.tierIdx} />
              <span style={{ ...display, fontWeight: winnerEntrant === homeEntrant ? 700 : 400, fontSize: 15 }}>{result.homeClub}</span>
            </div>
            <span style={{ ...mono, fontWeight: 700, textAlign: "center", whiteSpace: "nowrap" }}>{result.homeScore}-{result.awayScore}</span>
            <div style={{ display: "flex", alignItems: "start", gap: 6, justifyContent: "flex-end", textAlign: "right" }}>
              <span style={{ ...display, fontWeight: winnerEntrant === awayEntrant ? 700 : 400, fontSize: 15 }}>{result.awayClub}</span>
              <TierBadge tierId={awayEntrant.tierIdx} />
            </div>
          </div>
          {wentToPenalties && <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, marginTop: 6, textAlign: "center" }}>Decided on penalties</div>}
        </div>
        <div style={{ ...serif, fontSize: 14, color: userEliminated ? PALETTE.crimson : PALETTE.ink, marginBottom: 8 }}>
          {userWon
            ? `You're through to the next round${isUpset && winnerEntrant.club.id === userClubId ? " — a real giant-killer result!" : "."}`
            : "You're out of the US Open Cup this season."}
        </div>
        <button
          onClick={onClose}
          style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// A short, honest explanation of what actually decided a match — the
// single biggest line-rating gap between the two sides — so a result
// isn't just a scoreline with no way to learn from it.
function matchWhyExplanation(myRatings, oppRatings, myGoals, oppGoals) {
  const lines = [["defense", "def"], ["midfield", "mid"], ["attack", "att"]];
  const diffs = lines.map(([label, key]) => [label, key, myRatings[key] - oppRatings[key]]);
  const biggest = diffs.reduce((a, b) => (Math.abs(b[2]) > Math.abs(a[2]) ? b : a));
  const [label, key, diff] = biggest;

  if (myGoals === oppGoals) return "An even, hard-fought result — could have gone either way.";
  const won = myGoals > oppGoals;

  // Only attribute the result to a ratings gap when the gap actually points
  // the same direction as what really happened — previously this ignored
  // the scoreline entirely and could claim a team's own strength "was the
  // difference" in a game they lost, or that the opponent's edge "proved
  // too strong" in a game they actually won.
  if (won && diff > 0.5) return `Your ${label} (${myRatings[key]}★ vs their ${oppRatings[key]}★) was the difference.`;
  if (!won && diff < -0.5) return `Their ${label} (${oppRatings[key]}★ vs your ${myRatings[key]}★) proved too strong.`;
  if (won) return "A result that went your way despite a fairly even matchup on paper.";
  return "A tough result to take given how the matchup looked on paper — bound to happen sometimes.";
}

function MatchdayRecap({ results, userClubName, tier, onClose }) {
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
          let why = null;
          if (isUser && tier) {
            const myClub = tier.clubs.find((c) => c.name === userClubName);
            const isHome = m.homeClub === userClubName;
            const oppName = isHome ? m.awayClub : m.homeClub;
            const oppClub = tier.clubs.find((c) => c.name === oppName);
            const myGoals = isHome ? m.homeScore : m.awayScore;
            const oppGoals = isHome ? m.awayScore : m.homeScore;
            if (myClub && oppClub) why = matchWhyExplanation(clubLineRatings(myClub), clubLineRatings(oppClub), myGoals, oppGoals);
          }
          return (
            <div key={i} style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: isUser ? PALETTE.parchmentDim : "transparent", border: isUser ? `1px solid ${PALETTE.gold}` : "none" }}>
              <div style={{ ...display, fontWeight: 600, fontSize: 15, color: PALETTE.ink, display: "flex", alignItems: "center", gap: 6 }}>
                {m.homeClub} <span style={{ ...mono }}>{m.homeScore} - {m.awayScore}</span> {m.awayClub}
                {m.isRivalryMatch && (
                  <span style={{ ...display, fontSize: 10, fontWeight: 700, color: PALETTE.crimson, border: `1px solid ${PALETTE.crimson}`, borderRadius: 4, padding: "1px 5px" }}>
                    🔥 RIVALRY
                  </span>
                )}
              </div>
              {isUser && why && (
                <div style={{ marginTop: 4, fontSize: 12, color: PALETTE.inkSoft, ...serif, fontStyle: "italic" }}>{why}</div>
              )}
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

function SquadTab({ club, matchday, onToggleList, onRenew, onSetCaptain, tierId, difficulty, onToggleDP, onToggleRest, onToggleHoldBack, onLoanOut, playersOnLoan, tier }) {
  const [lineupOpen, setLineupOpen] = useState(false);
  const xi = startingXI(club, matchday);
  const xiIds = new Set(xi.map((p) => p.id));
  const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const xiSorted = [...xi].sort((a, b) => posOrder[a.position] - posOrder[b.position]);

  const sorted = [...club.squad].sort((a, b) => posOrder[a.position] - posOrder[b.position] || b.overall - a.overall);
  const captainOnPitch = xi.some((p) => p.id === club.captainId);
  const actingCaptain = captainOnPitch ? null : [...xi].sort((a, b) => b.leadership - a.leadership)[0];
  const lineRatings = clubLineRatings(club);
  const dpEnabled = tierId === 0 && DIFFICULTY_MODES[difficulty]?.dps;
  const dpIds = new Set(club.designatedPlayerIds || []);

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

      {playersOnLoan && playersOnLoan.length > 0 && (
        <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 16 }}>
          📤 {playersOnLoan.length} player{playersOnLoan.length === 1 ? "" : "s"} out on loan — {playersOnLoan.map((e) => e.player.name).join(", ")}, back next season.
        </div>
      )}

      {DIFFICULTY_MODES[difficulty]?.boardPressure && (
        <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ ...display, fontSize: 11, textTransform: "uppercase", color: PALETTE.inkSoft, letterSpacing: "0.05em" }}>Board happiness</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 100, height: 8, background: PALETTE.parchmentDim, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${club.boardHappiness ?? 60}%`, height: "100%", background: (club.boardHappiness ?? 60) < 25 ? PALETTE.crimson : (club.boardHappiness ?? 60) < 50 ? PALETTE.bronze : "#2E7D32" }} />
              </div>
              <span style={{ ...mono, fontSize: 12, color: PALETTE.ink }}>{club.boardHappiness ?? 60}</span>
            </div>
          </div>
          {club.boardObjective && (
            <div>
              <span style={{ ...display, fontSize: 11, textTransform: "uppercase", color: PALETTE.inkSoft, letterSpacing: "0.05em" }}>Objective</span>
              <div style={{ ...serif, fontSize: 13, color: PALETTE.ink }}>{club.boardObjective.description}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 16, border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8 }}>
        <button
          onClick={() => setLineupOpen((v) => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
          }}
        >
          <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>
            Current lineup — {club.tactics.formation} {captainOnPitch ? "· captain on the pitch" : actingCaptain ? `· ${actingCaptain.name} wears the armband today` : ""}
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
                      : p.transferRequested ? <span style={{ color: PALETTE.crimson }} title="Unhappy about game time — asked to leave">😠 wants out — ${p.askingPrice?.toLocaleString()}</span>
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
                    {dpEnabled && (dpIds.has(p.id) || dpIds.size < MAX_DESIGNATED_PLAYERS) && (
                      <button
                        onClick={() => onToggleDP(p.id)}
                        title="Designated Player — wage exempt from payroll"
                        style={{
                          fontSize: 11, padding: "4px 8px", borderRadius: 5, cursor: "pointer", ...display,
                          border: `1px solid ${PALETTE.gold}`, background: dpIds.has(p.id) ? PALETTE.gold : "none",
                          color: dpIds.has(p.id) ? PALETTE.ink : PALETTE.gold, fontWeight: dpIds.has(p.id) ? 700 : 400,
                        }}
                      >
                        {dpIds.has(p.id) ? "DP ✓" : "Make DP"}
                      </button>
                    )}
                    <button
                      onClick={() => onToggleRest(p.id)}
                      title="Rest for the next match only"
                      style={{
                        fontSize: 12, width: 26, height: 26, borderRadius: 5, cursor: "pointer", padding: 0,
                        border: `1px solid ${p.restRequested ? PALETTE.bronze : PALETTE.parchmentDim}`,
                        background: p.restRequested ? PALETTE.bronze : "none", color: p.restRequested ? "#fff" : PALETTE.inkSoft,
                      }}
                    >
                      💤
                    </button>
                    <button
                      onClick={() => onToggleHoldBack(p.id)}
                      title="Hold back from US Open Cup matches"
                      style={{
                        fontSize: 12, width: 26, height: 26, borderRadius: 5, cursor: "pointer", padding: 0,
                        border: `1px solid ${p.holdBackForCup ? PALETTE.gold : PALETTE.parchmentDim}`,
                        background: p.holdBackForCup ? PALETTE.gold : "none", color: p.holdBackForCup ? PALETTE.ink : PALETTE.inkSoft,
                      }}
                    >
                      🛡
                    </button>
                    {p.age <= 21 && (
                      <button
                        onClick={() => onLoanOut(p.id)}
                        title="Loan out for the season — returns next season, having developed"
                        style={{
                          fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.inkSoft}`,
                          background: "none", color: PALETTE.inkSoft, cursor: "pointer", ...display,
                        }}
                      >
                        Loan Out
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

// Looks at the squad's actual personnel — which line is strongest, and
// whether the squad is built for pace/attack or physicality/defense — and
// suggests a formation/style/press combo to match, with a plain-language
// reason. This is what answers "how do I set my team up" instead of
// leaving formation/style as unlabeled buttons with no connection to who's
// actually on the roster.
function suggestTactics(club, oppRatings, tier) {
  const lineRatings = clubLineRatings(club);
  const lines = [["def", lineRatings.def], ["mid", lineRatings.mid], ["att", lineRatings.att]];
  const strongest = lines.reduce((a, b) => (b[1] > a[1] ? b : a));
  const attMinusDef = lineRatings.att - lineRatings.def;

  let formation, formationReason;
  if (attMinusDef >= 1) { formation = "4-3-3"; formationReason = `your attack (${lineRatings.att}★) is well ahead of your defense (${lineRatings.def}★)`; }
  else if (attMinusDef <= -1) { formation = "5-3-2"; formationReason = `your defense (${lineRatings.def}★) is your clear strength over your attack (${lineRatings.att}★)`; }
  else if (strongest[0] === "mid") { formation = "4-2-3-1"; formationReason = `your midfield (${lineRatings.mid}★) is your best line`; }
  else { formation = "4-4-2"; formationReason = "your squad is fairly balanced across all three lines"; }

  const outfield = club.squad.filter((p) => p.position !== "GK");
  const avgPace = outfield.length ? outfield.reduce((s, p) => s + p.pace, 0) / outfield.length : 50;
  const avgPhysical = outfield.length ? outfield.reduce((s, p) => s + p.physical, 0) / outfield.length : 50;

  // Opponent-aware override: when the next opponent is scouted and the
  // gap is clear-cut, THIS takes priority over generic squad-personnel
  // logic — this is what makes the suggestion actually respond to who
  // you're about to play, not just describe your own roster back to you.
  let style, press, styleReason;
  if (oppRatings) {
    const attEdge = lineRatings.att - oppRatings.def;
    const defEdge = oppRatings.att - lineRatings.def;
    if (defEdge >= 1 && defEdge >= attEdge) {
      style = "defensive"; press = "low";
      styleReason = `their attack (${oppRatings.att}★) threatens your defense (${lineRatings.def}★) — sit in and stay solid against them`;
    } else if (attEdge >= 1) {
      style = "attacking"; press = avgPace >= 64 ? "high" : "medium";
      styleReason = `your attack (${lineRatings.att}★) should trouble their defense (${oppRatings.def}★) — press the advantage`;
    }
  }
  if (!style) {
    if (attMinusDef >= 1 || avgPace >= 66) {
      style = "attacking"; press = avgPace >= 68 ? "high" : "medium";
      styleReason = avgPace >= 66 ? `your squad's average pace (${Math.round(avgPace)}) supports an attacking, high-tempo approach` : formationReason;
    } else if (attMinusDef <= -1 || avgPhysical >= 66) {
      style = "defensive"; press = "low";
      styleReason = avgPhysical >= 66 ? `your squad is built physical (avg ${Math.round(avgPhysical)}) — sitting in and staying solid suits that` : formationReason;
    } else {
      style = "balanced"; press = "medium";
      styleReason = "nothing about your squad strongly favors one extreme, so a balanced approach is the safer bet";
    }
  }

  return { formation, style, press, reason: `${formationReason[0].toUpperCase()}${formationReason.slice(1)} — ${styleReason === formationReason ? "which also points to" : "and"} ${style}, ${press} press.` };
}

function TacticsTab({ club, matchday, onChange, tier }) {
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
  let nextOppRatings = null;
  if (tier) {
    const userFixtures = tier.fixtures.filter((f) => f.homeClubId === club.id || f.awayClubId === club.id);
    const nextFixture = userFixtures.find((f) => !f.played);
    if (nextFixture) {
      const oppId = nextFixture.homeClubId === club.id ? nextFixture.awayClubId : nextFixture.homeClubId;
      const opponent = tier.clubs.find((c) => c.id === oppId);
      if (opponent) nextOppRatings = clubLineRatings(opponent);
    }
  }
  const suggestion = suggestTactics(club, nextOppRatings, tier);
  const matchesSuggestion = club.tactics.formation === suggestion.formation && club.tactics.style === suggestion.style && club.tactics.press === suggestion.press;
  const applySuggestion = () => {
    onChange("formation", suggestion.formation);
    onChange("style", suggestion.style);
    onChange("press", suggestion.press);
  };

  return (
    <div>
      <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
        Current XI rating
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        {[["DEF", lineRatings.def], ["MID", lineRatings.mid], ["ATT", lineRatings.att]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase" }}>{label}</span>
            <span style={{ color: PALETTE.gold, fontSize: 16 }}><StarRow value={val} /></span>
          </div>
        ))}
      </div>

      {!matchesSuggestion && (
        <div style={{ background: "#E4D9C4", border: `1px solid ${PALETTE.bronze}`, borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 13, color: PALETTE.ink, marginBottom: 4 }}>
            Suggested for your squad: {suggestion.formation}, {suggestion.style}, {suggestion.press} press
          </div>
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 10 }}>{suggestion.reason}</div>
          <button
            onClick={applySuggestion}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: PALETTE.ink, color: PALETTE.parchment, fontSize: 12.5, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Apply Suggestion
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 420, flex: 1, minWidth: 260 }}>
          <Row label="Formation" value={club.tactics.formation} options={formations} field="formation" />
          <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, marginTop: -10, marginBottom: 18 }}>
            {FORMATION_NOTES[club.tactics.formation]}
          </div>
          <Row label="Style" value={club.tactics.style} options={["defensive", "balanced", "attacking"]} field="style" />
          <Row label="Press" value={club.tactics.press} options={["low", "medium", "high"]} field="press" />
          <Row
            label="Lineup Selection"
            value={club.tactics.lineupMode || "best"}
            options={["best", "youth", "auto"]}
            optionLabels={{ best: "Best XI", youth: "Youth", auto: "Auto" }}
            field="lineupMode"
          />
          <div style={{ marginTop: 4, marginBottom: 18 }}>
            <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 6 }}>
              Rest threshold — {club.tactics.restThreshold ?? 0}% fitness
            </div>
            <input
              type="range" min={0} max={80} step={5}
              value={club.tactics.restThreshold ?? 0}
              onChange={(e) => onChange("restThreshold", Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ ...serif, fontSize: 11.5, color: PALETTE.inkSoft, marginTop: 4 }}>
              Anyone below this fitness sits out automatically — applies no matter which lineup mode is selected above. Never leaves you short of a full XI.
            </div>
          </div>
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

function MatchLine({ label, outcome, revealed = true }) {
  if (!outcome) return null;
  if (!revealed) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
        <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, flexShrink: 0 }}>{label}</span>
        <span style={{ color: PALETTE.inkSoft, fontStyle: "italic" }}>TBD</span>
      </div>
    );
  }
  const { result, wentToPenalties, winner } = outcome;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
      <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1 }}>
        <span style={{ fontWeight: winner.name === result.homeClub ? 700 : 400 }}>{result.homeClub}</span>
        {" "}<span style={{ ...mono }}>{result.homeScore}-{result.awayScore}</span>{" "}
        <span style={{ fontWeight: winner.name === result.awayClub ? 700 : 400 }}>{result.awayClub}</span>
        {wentToPenalties && <span style={{ color: PALETTE.inkSoft, fontSize: 11 }}> (pens)</span>}
      </span>
    </div>
  );
}

function SeriesLine({ label, series, revealed = true }) {
  if (!series) return null;
  if (!revealed) {
    return (
      <div style={{ padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
        <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, display: "inline-block" }}>{label}</span>
        <span style={{ color: PALETTE.inkSoft, fontStyle: "italic" }}>TBD</span>
      </div>
    );
  }
  const loserWins = series.hWins > series.lWins ? series.lWins : series.hWins;
  const winnerWins = Math.max(series.hWins, series.lWins);
  const game1 = series.games[0].result;
  const loserName = game1.homeClub === series.winner.name ? game1.awayClub : game1.homeClub;
  return (
    <div style={{ padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
      <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, display: "inline-block" }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{series.winner.name}</span> beats {loserName}, wins series {winnerWins}-{loserWins}
      <span style={{ color: PALETTE.inkSoft }}> ({series.games.map((g) => `${g.result.homeScore}-${g.result.awayScore}`).join(", ")})</span>
    </div>
  );
}

function ConferenceBracket({ label, conf, revealedRounds }) {
  if (!conf) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <MatchLine label="Wild Card" outcome={conf.wildcard} revealed={revealedRounds > 0} />
      <SeriesLine label="1 seed" series={conf.r1a} revealed={revealedRounds > 1} />
      <SeriesLine label="2 seed" series={conf.r1b} revealed={revealedRounds > 1} />
      <SeriesLine label="3 seed" series={conf.r1c} revealed={revealedRounds > 1} />
      <SeriesLine label="4 seed" series={conf.r1d} revealed={revealedRounds > 1} />
      <MatchLine label="Semifinal" outcome={conf.semiA} revealed={revealedRounds > 2} />
      <MatchLine label="Semifinal" outcome={conf.semiB} revealed={revealedRounds > 2} />
      <MatchLine label="Conf Final" outcome={conf.confFinal} revealed={revealedRounds > 3} />
    </div>
  );
}

// Total "rounds" per competition, for reveal-stepping purposes
const MLS_TOTAL_ROUNDS = 5; // wildcard, round one, conf semis, conf final, cup final
const USLC_TOTAL_ROUNDS = 3; // QF, SF, final
const PROMO_TOTAL_ROUNDS = 2; // semis, final
const MAX_POSTSEASON_ROUNDS = Math.max(MLS_TOTAL_ROUNDS, USLC_TOTAL_ROUNDS, PROMO_TOTAL_ROUNDS);

// Unlike MatchLine (built for a single tier's bracket), a US Open Cup match
// is between clubs from potentially different tiers — shows a badge on
// each side and flags a giant-killer upset with a lightning bolt.
function CupMatchLine({ match, userClubId }) {
  const { homeEntrant, awayEntrant, outcome, winnerEntrant, isUpset } = match;
  const { result, wentToPenalties } = outcome;
  const isUserMatch = homeEntrant.club.id === userClubId || awayEntrant.club.id === userClubId;
  const homeWon = winnerEntrant === homeEntrant;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", columnGap: 8, padding: "8px", fontSize: 12.5, ...serif,
      borderBottom: `1px solid ${PALETTE.parchmentDim}`, background: isUserMatch ? `${PALETTE.gold}18` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "start", gap: 5, textAlign: "left" }}>
        <TierBadge tierId={homeEntrant.tierIdx} />
        <span style={{ fontWeight: homeWon ? 700 : 400 }}>{result.homeClub}{isUpset && homeWon ? " ⚡" : ""}</span>
      </div>
      <span style={{ ...mono, flexShrink: 0, textAlign: "center", whiteSpace: "nowrap", padding: "0 4px" }}>
        {result.homeScore}-{result.awayScore}{wentToPenalties ? " (pens)" : ""}
      </span>
      <div style={{ display: "flex", alignItems: "start", gap: 5, justifyContent: "flex-end", textAlign: "right" }}>
        <span style={{ fontWeight: !homeWon ? 700 : 400 }}>{isUpset && !homeWon ? "⚡ " : ""}{result.awayClub}</span>
        <TierBadge tierId={awayEntrant.tierIdx} />
      </div>
    </div>
  );
}

// Once a round's been drawn (but not yet played), find who the user's own
// club is paired against — or whether they drew a bye — so it can be
// shown as a real opponent preview instead of just "a round is coming up."
function findUserDrawnOpponent(pendingDraw, userClubId) {
  if (!pendingDraw) return null;
  if (pendingDraw.byeEntrant?.club.id === userClubId) return { bye: true };
  for (const [home, away] of pendingDraw.pairs) {
    if (home.club.id === userClubId) return { opponent: away, isHome: true };
    if (away.club.id === userClubId) return { opponent: home, isHome: false };
  }
  return null; // not in this round's draw at all (not yet qualified, or eliminated)
}

function UsOpenCupTab({ usOpenCup, pendingRoundIndex, onPlayRound, userClubId }) {
  const hasStarted = !!usOpenCup;
  const done = usOpenCup?.done ?? false;
  const champion = usOpenCup?.champion;
  const drawnOpponent = pendingRoundIndex !== null ? findUserDrawnOpponent(usOpenCup?.pendingDraw, userClubId) : null;

  if (!hasStarted && pendingRoundIndex === null) {
    return (
      <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "20px 4px" }}>
        The US Open Cup kicks off at matchday {US_OPEN_CUP_ROUND_MATCHDAYS[0]} — league fixtures pause that week so you can play your cup match here instead.
      </div>
    );
  }

  return (
    <div>
      {done && (
        <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.gold, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <TierBadge tierId={champion.tierIdx} /> 🏆 {champion.club.name} win the US Open Cup
        </div>
      )}
      {pendingRoundIndex !== null && (
        <div style={{ background: "#D9C6E8", border: `1px solid ${PALETTE.ink}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.ink, marginBottom: 8 }}>
            {cupRoundLabel(pendingRoundIndex)} is up this week — league fixtures are on hold until it's played.
          </div>
          {drawnOpponent && (
            <div style={{ ...serif, fontSize: 13, color: PALETTE.ink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              {drawnOpponent.bye
                ? "You've drawn a bye this round — straight through to the next one."
                : <>Your draw: <TierBadge tierId={drawnOpponent.opponent.tierIdx} /> <strong>{drawnOpponent.isHome ? "vs" : "@"} {drawnOpponent.opponent.club.name}</strong></>}
            </div>
          )}
          <button
            onClick={onPlayRound}
            style={{ padding: "9px 16px", borderRadius: 6, border: "none", background: PALETTE.ink, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Play {cupRoundLabel(pendingRoundIndex)}
          </button>
        </div>
      )}
      {!done && pendingRoundIndex === null && hasStarted && (() => {
        const nextTrigger = US_OPEN_CUP_ROUND_MATCHDAYS[usOpenCup.rounds.length];
        return nextTrigger ? (
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 16, fontStyle: "italic" }}>
            Next cup round comes up at matchday {nextTrigger}.
          </div>
        ) : null;
      })()}
      {hasStarted && [...usOpenCup.rounds].reverse().map((round, ri) => (
        <div key={ri} style={{ marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>{round.label}</div>
          {round.matches.map((m, mi) => <CupMatchLine key={mi} match={m} userClubId={userClubId} />)}
          {round.byeEntrant && (
            <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, padding: "6px 8px", display: "flex", alignItems: "center", gap: 5 }}>
              <TierBadge tierId={round.byeEntrant.tierIdx} /> {round.byeEntrant.club.name} received a bye this round.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PlayoffBracketSection({ seasonPlayoffs, tierId, revealedRounds, onSimRound, onSimRest }) {
  if (!seasonPlayoffs) return null;
  const promo = seasonPlayoffs.promotionPlayoffs.find((pp) => pp.tierIdx === tierId);
  const showMls = tierId === 0 && seasonPlayoffs.mlsPlayoffResult;
  const showUslc = tierId === 1 && seasonPlayoffs.uslcPlayoffResult;
  if (!promo && !showMls && !showUslc) return null;

  const myTotalRounds = showMls ? MLS_TOTAL_ROUNDS : showUslc ? USLC_TOTAL_ROUNDS : PROMO_TOTAL_ROUNDS;
  const done = revealedRounds >= myTotalRounds;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>
          Postseason
        </div>
        {!done && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onSimRound}
              style={{ ...display, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer" }}
            >
              Sim Next Round
            </button>
            <button
              onClick={onSimRest}
              style={{ ...display, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", color: PALETTE.ink, cursor: "pointer" }}
            >
              Sim Rest of Postseason
            </button>
          </div>
        )}
      </div>

      {showMls && (
        <div>
          {revealedRounds > 4 && (
            <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.gold, marginBottom: 12 }}>
              🏆 {seasonPlayoffs.mlsPlayoffResult.champion.name} win the MLS Cup
            </div>
          )}
          <ConferenceBracket label="Eastern Conference" conf={seasonPlayoffs.mlsPlayoffResult.east} revealedRounds={revealedRounds} />
          <ConferenceBracket label="Western Conference" conf={seasonPlayoffs.mlsPlayoffResult.west} revealedRounds={revealedRounds} />
          <MatchLine label="MLS Cup" outcome={seasonPlayoffs.mlsPlayoffResult.finalResult} revealed={revealedRounds > 4} />
        </div>
      )}

      {showUslc && (
        <div>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>Quarterfinals</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[0]?.map((o, i) => <MatchLine key={i} label={`QF${i + 1}`} outcome={o} revealed={revealedRounds > 0} />)}
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", margin: "8px 0 4px" }}>Semifinals</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[1]?.map((o, i) => <MatchLine key={i} label={`SF${i + 1}`} outcome={o} revealed={revealedRounds > 1} />)}
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", margin: "8px 0 4px" }}>Final</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[2]?.map((o, i) => <MatchLine key={i} label="Final" outcome={o} revealed={revealedRounds > 2} />)}
          {revealedRounds > 2 && (
            <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.gold, marginTop: 8 }}>
              🏆 {seasonPlayoffs.uslcPlayoffResult.champion.name} win the USL Cup
            </div>
          )}
        </div>
      )}

      {promo && (
        <div>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>
            Promotion Playoff — final spot to {TIER_META[tierId - 1].name}
          </div>
          {promo.bracket ? (
            <>
              <MatchLine label="Semifinal" outcome={promo.bracket.semi1} revealed={revealedRounds > 0} />
              <MatchLine label="Semifinal" outcome={promo.bracket.semi2} revealed={revealedRounds > 0} />
              <MatchLine label="Final" outcome={promo.bracket.final} revealed={revealedRounds > 1} />
              {revealedRounds > 1 && (
                <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.gold, marginTop: 8 }}>
                  ⬆️ {promo.bracket.final.winner.name} promoted
                </div>
              )}
            </>
          ) : (
            <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft }}>Not enough clubs for a playoff this season.</div>
          )}
        </div>
      )}
    </div>
  );
}

function StandingsTable({ table, userClubId }) {
  return (
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
  );
}

function TableTab({ tier, userClubId, seasonPlayoffs, revealedRounds, onSimRound, onSimRest }) {
  const [view, setView] = useState("auto"); // "auto" picks bracket-if-postseason, else standings
  const [mlsView, setMlsView] = useState("overall"); // "overall" (Shield standings) | "conference"
  const table = computeTable(tier);

  const promo = seasonPlayoffs?.promotionPlayoffs.find((pp) => pp.tierIdx === tier.id);
  const hasBracket = seasonPlayoffs && (
    (tier.id === 0 && seasonPlayoffs.mlsPlayoffResult) ||
    (tier.id === 1 && seasonPlayoffs.uslcPlayoffResult) ||
    !!promo
  );
  const showingBracket = hasBracket && view !== "standings";

  return (
    <div style={{ overflowX: "auto" }}>
      {hasBracket && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setView("auto")}
            style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: showingBracket ? PALETTE.ink : "none", color: showingBracket ? PALETTE.parchment : PALETTE.ink }}
          >
            Bracket
          </button>
          <button
            onClick={() => setView("standings")}
            style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: !showingBracket ? PALETTE.ink : "none", color: !showingBracket ? PALETTE.parchment : PALETTE.ink }}
          >
            Final Standings
          </button>
        </div>
      )}

      {showingBracket ? (
        <PlayoffBracketSection seasonPlayoffs={seasonPlayoffs} tierId={tier.id} revealedRounds={revealedRounds} onSimRound={onSimRound} onSimRest={onSimRest} />
      ) : (
        <>
          {tier.id === 0 && !hasBracket && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => setMlsView("overall")}
                style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: mlsView === "overall" ? PALETTE.ink : "none", color: mlsView === "overall" ? PALETTE.parchment : PALETTE.ink }}
              >
                Overall (Shield)
              </button>
              <button
                onClick={() => setMlsView("conference")}
                style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: mlsView === "conference" ? PALETTE.ink : "none", color: mlsView === "conference" ? PALETTE.parchment : PALETTE.ink }}
              >
                By Conference
              </button>
            </div>
          )}
          {tier.id === 0 && mlsView === "conference" && !hasBracket ? (() => {
            const conferenceByClubId = new Map(tier.clubs.map((c) => [c.id, c.conference]));
            return (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Eastern Conference</div>
                  <StandingsTable table={table.filter((r) => conferenceByClubId.get(r.clubId) === "East")} userClubId={userClubId} />
                </div>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Western Conference</div>
                  <StandingsTable table={table.filter((r) => conferenceByClubId.get(r.clubId) === "West")} userClubId={userClubId} />
                </div>
              </div>
            );
          })() : (
            <StandingsTable table={table} userClubId={userClubId} />
          )}
        </>
      )}
    </div>
  );
}

// Builds a short preview of what's coming up — interleaving ordinary
// league matchdays with US Open Cup rounds — so a manager can actually
// plan rotation ahead of a cup week instead of finding out reactively.
// This is a preview only (it assumes each cup round gets played on
// schedule), not an authoritative source.
function buildUpcomingSchedule(tier, userClubId, usOpenCup, startMatchday, count) {
  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  const items = [];
  let cupRoundsAssumedPlayed = usOpenCup?.rounds?.length ?? 0;
  let cupDone = usOpenCup?.done ?? false;
  for (let md = startMatchday; items.length < count && md <= startMatchday + 40; md++) {
    const cupIdx = US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(md);
    if (!cupDone && cupIdx !== -1 && cupIdx === cupRoundsAssumedPlayed) {
      items.push({ type: "cup", label: cupRoundLabel(cupIdx), matchday: md, roundIndex: cupIdx });
      cupRoundsAssumedPlayed++;
      if (cupRoundsAssumedPlayed >= US_OPEN_CUP_TOTAL_ROUNDS) cupDone = true;
      continue;
    }
    const fx = userFixtures.find((f) => f.matchday === md);
    if (fx) {
      const oppId = fx.homeClubId === userClubId ? fx.awayClubId : fx.homeClubId;
      const opp = tier.clubs.find((c) => c.id === oppId);
      const isHome = fx.homeClubId === userClubId;
      items.push({ type: "league", label: opp?.name ?? "?", isHome, matchday: md });
    }
  }
  return items;
}

function FixturesTab({ tier, userClubId, usOpenCup }) {
  const clubName = (id) => tier.clubs.find((c) => c.id === id)?.name ?? "?";
  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  const nextFixture = userFixtures.find((f) => !f.played);
  const opponentId = nextFixture ? (nextFixture.homeClubId === userClubId ? nextFixture.awayClubId : nextFixture.homeClubId) : null;
  const opponent = opponentId ? tier.clubs.find((c) => c.id === opponentId) : null;
  const userClub = tier.clubs.find((c) => c.id === userClubId);

  let scouting = null;
  if (opponent && userClub) {
    const oppRatings = clubLineRatings(opponent);
    const myRatings = clubLineRatings(userClub);
    const table = computeTable(tier);
    const oppRow = table.find((r) => r.clubId === opponentId);
    const oppForm = oppRow ? oppRow.form.slice(-5) : [];
    const diffs = [
      ["theirAttackVsMyDefense", oppRatings.att - myRatings.def], // positive = danger (their attack beats my defense)
      ["myAttackVsTheirDefense", myRatings.att - oppRatings.def], // positive = opportunity (my attack beats their defense)
      ["midfield", myRatings.mid - oppRatings.mid], // positive = my edge
    ];
    const biggestEdge = diffs.reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a));
    const oppLosses = oppForm.filter((r) => r === "L").length;
    const oppWins = oppForm.filter((r) => r === "W").length;
    let tip;
    if (Math.abs(biggestEdge[1]) < 1) {
      tip = "This looks like an even matchup on paper — a balanced approach is reasonable.";
    } else if (biggestEdge[0] === "theirAttackVsMyDefense") {
      tip = biggestEdge[1] > 0
        ? `Their attack (${oppRatings.att}★) is notably stronger than your defense (${myRatings.def}★) — consider a more defensive setup.`
        : `Your defense (${myRatings.def}★) should hold up well against their attack (${oppRatings.att}★) — a solid platform to play from.`;
    } else if (biggestEdge[0] === "myAttackVsTheirDefense") {
      tip = biggestEdge[1] > 0
        ? `Your attack (${myRatings.att}★) is notably stronger than their defense (${oppRatings.def}★) — an attacking approach could pay off.`
        : `Their defense (${oppRatings.def}★) is well ahead of your attack (${myRatings.att}★) — goals may be hard to come by.`;
    } else if (biggestEdge[1] > 0) {
      tip = `You have the edge in midfield (${myRatings.mid}★ vs ${oppRatings.mid}★) — control the game through the middle and let your other lines follow.`;
    } else {
      tip = `They control the midfield battle (${oppRatings.mid}★ vs your ${myRatings.mid}★) — a more direct approach may bypass it better than trying to out-possess them.`;
    }
    if (oppForm.length >= 3 && oppLosses >= 3) tip += ` They're out of form lately (${oppForm.join("")}) — a good time to be aggressive.`;
    else if (oppForm.length >= 3 && oppWins >= 4) tip += ` They're red-hot right now (${oppForm.join("")}) — don't take them lightly.`;
    scouting = { opponent, oppRatings, oppForm, tip };
  }

  const nextMd = userFixtures.find((f) => !f.played)?.matchday ?? null;
  const upcoming = nextMd !== null ? buildUpcomingSchedule(tier, userClubId, usOpenCup, nextMd, 6) : [];

  return (
    <div>
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Upcoming
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {upcoming.map((item, i) => {
              const drawn = item.type === "cup" && usOpenCup?.pendingDraw?.roundIndex === item.roundIndex
                ? findUserDrawnOpponent(usOpenCup.pendingDraw, userClubId)
                : null;
              const cupText = drawn
                ? drawn.bye ? `⭐ ${item.label} (bye)` : `⭐ ${item.label}: ${drawn.isHome ? "vs" : "@"} ${drawn.opponent.club.name}`
                : `⭐ ${item.label}`;
              return (
                <div key={i} style={{
                  padding: "6px 10px", borderRadius: 6, fontSize: 12, ...serif,
                  background: item.type === "cup" ? `${PALETTE.gold}22` : PALETTE.parchmentDim,
                  border: item.type === "cup" ? `1px solid ${PALETTE.gold}` : `1px solid ${PALETTE.parchmentDim}`,
                }}>
                  {item.type === "cup" ? cupText : `${item.isHome ? "vs" : "@"} ${item.label}`}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {scouting && (
        <div style={{ background: PALETTE.parchmentDim, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Next Opponent — {scouting.opponent.name}
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            {[["DEF", scouting.oppRatings.def], ["MID", scouting.oppRatings.mid], ["ATT", scouting.oppRatings.att]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...display, fontSize: 11, fontWeight: 700, color: PALETTE.inkSoft }}>{label}</span>
                <span style={{ color: PALETTE.gold, fontSize: 14 }}><StarRow value={val} /></span>
              </div>
            ))}
            {scouting.oppForm.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...display, fontSize: 11, fontWeight: 700, color: PALETTE.inkSoft }}>FORM</span>
                <FormBadges form={scouting.oppForm} />
              </div>
            )}
          </div>
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.ink }}>{scouting.tip}</div>
        </div>
      )}
      {userFixtures.map((f) => (
        <div key={f.id} style={{
          display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13,
          borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif,
          background: (!f.played && f.id === nextFixture?.id) ? `${PALETTE.gold}18` : "none",
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

// Scores a listed player for how good a fit they'd be for this specific
// club right now — not just "is this player good" but "does THIS club need
// THIS player": position need (weak line, thin depth, contracts expiring),
// how much of an upgrade they'd actually be over the incumbents, age fit,
// and whether the club can really afford them (price up front, and wage
// room if wages are tracked). Higher score = better recommendation.
function computeRecommendationScore(player, userClub, difficulty, tierIdx) {
  const squadAtPos = userClub.squad.filter((p) => p.position === player.position);
  const avgAtPos = squadAtPos.length ? squadAtPos.reduce((s, p) => s + p.overall, 0) / squadAtPos.length : 0;
  const bestAtPos = squadAtPos.length ? Math.max(...squadAtPos.map((p) => p.overall)) : 0;
  const depthCount = squadAtPos.length;
  const expiringCount = squadAtPos.filter((p) => p.contractYearsLeft <= 1).length;

  // Hard quality floor: extreme "need" (a razor-thin or weak position)
  // could previously push a genuinely bad player's score positive purely
  // off desperation, even for an MLS club — a 35-45 overall signing is
  // never actually a recommendation regardless of how thin the position
  // is. Two independent floors: never far below what's normal for the
  // club's own tier, and never a clear downgrade from what's already
  // rostered there (unless the position is empty, a true emergency).
  const tierFloor = TIER_META[tierIdx].baseRating - 15;
  if (player.overall < tierFloor) return -Infinity;
  if (depthCount > 0 && player.overall < avgAtPos - 10) return -Infinity;

  // Need: a weak, thin, or soon-to-be-depleted position group is a bigger
  // priority than topping up a position that's already deep and strong.
  // A squad only ever needs ~2 keepers, never the 4 that makes sense as a
  // depth target for outfield lines — without this split, every listed GK
  // registered as "thin" and flooded the recommendations.
  const idealDepth = player.position === "GK" ? 2 : 4;
  let needScore = 0;
  needScore += Math.max(0, 60 - avgAtPos) * 0.6;
  needScore += Math.max(0, idealDepth - depthCount) * 8;
  needScore += expiringCount * 10;

  // Upgrade: how much better is this player than the best you've already got there
  const upgrade = player.overall - bestAtPos;
  const upgradeScore = clamp(upgrade * 3, -30, 40);

  // Age: some preference for players who fit a normal development
  // timeline; an older signing needs to be a clear upgrade to justify itself
  let ageScore = 0;
  if (player.age <= 26) ageScore += 6;
  else if (player.age >= 31 && upgrade < 8) ageScore -= 10;

  // Afford it at all? If not, this isn't a real recommendation regardless
  // of how good a fit it looks on paper.
  if (userClub.budget < player.askingPrice) return -Infinity;
  let financeScore = 10;
  if (DIFFICULTY_MODES[difficulty]?.wagesDeducted) {
    const currentPayroll = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
    const remainingRoom = userClub.budget - currentPayroll;
    if (player.wage > 0 && remainingRoom > 0) {
      const wageShare = player.wage / Math.max(remainingRoom, 1);
      financeScore -= clamp(wageShare * 15, 0, 20);
    }
  }

  return needScore + upgradeScore + ageScore + financeScore;
}

function recommendationReason(player, userClub, xi) {
  const squadAtPos = userClub.squad.filter((p) => p.position === player.position);
  const bestAtPos = squadAtPos.length ? Math.max(...squadAtPos.map((p) => p.overall)) : 0;
  const depthCount = squadAtPos.length;
  const upgrade = player.overall - bestAtPos;
  const reasons = [];
  if (depthCount === 0) reasons.push(`no ${player.position} on your roster right now`);
  else if (depthCount <= 2) reasons.push(`thin at ${player.position} (${depthCount} on roster)`);

  // Prioritize naming an actual STARTER this would replace — that's a far
  // more actionable, concrete signal than just "your weakest bench player
  // at this position," which might not even be someone you're playing.
  const startersAtPos = (xi || []).filter((p) => p.position === player.position);
  const weakestStarter = startersAtPos.length ? [...startersAtPos].sort((a, b) => a.overall - b.overall)[0] : null;
  const weakestAtPos = squadAtPos.length ? [...squadAtPos].sort((a, b) => a.overall - b.overall)[0] : null;

  if (weakestStarter && player.overall > weakestStarter.overall + 3) {
    reasons.push(`would replace ${weakestStarter.name} in your starting XI (${weakestStarter.overall} OVR)`);
  } else if (weakestAtPos && player.overall > weakestAtPos.overall + 3) {
    reasons.push(`would replace ${weakestAtPos.name} (${weakestAtPos.overall} OVR)`);
  } else if (upgrade > 5) {
    reasons.push(`+${upgrade} OVR upgrade`);
  } else if (upgrade > 0) {
    reasons.push("modest upgrade");
  }
  if (player.age <= 23) reasons.push(`age ${player.age}, room to grow`);
  return reasons.length ? reasons.join(" · ") : "solid depth option";
}

function MarketTab({ tiers, userClub, userTierId, onBuy, difficulty, matchday }) {
  const [sortField, setSortField] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const xi = startingXI(userClub, matchday ?? 1);

  const listed = [];
  tiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id === userClub.id) return;
      c.squad.forEach((p) => {
        if (p.transferListed) listed.push({ player: p, seller: c, tierId: t.id });
      });
    });
  });

  const isRecommended = sortField === "recommended";
  let recommendedList = [];
  if (isRecommended) {
    listed.forEach((entry) => { entry.score = computeRecommendationScore(entry.player, userClub, difficulty, userTierId); });
    const affordable = listed.filter((e) => e.score > -Infinity);
    affordable.sort((a, b) => b.score - a.score);
    // Cap per-position so the list reads as "a couple good options in each
    // area of need" rather than one position (especially GK, which has few
    // real slots to begin with) crowding out everything else. GK capped
    // hard at 1 — a squad rarely needs to shop for more than one keeper
    // at a time, so even 2 felt like too many relative to outfield needs.
    const MAX_PER_POSITION = { GK: 1, DEF: 6, MID: 6, FWD: 6 };
    const perPositionCount = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    const RECOMMENDED_TOTAL = 18;
    for (const entry of affordable) {
      if (recommendedList.length >= RECOMMENDED_TOTAL) break;
      const pos = entry.player.position;
      const cap = MAX_PER_POSITION[pos] ?? 5;
      if ((perPositionCount[pos] ?? 0) >= cap) continue;
      recommendedList.push(entry);
      perPositionCount[pos] = (perPositionCount[pos] ?? 0) + 1;
    }
  } else {
    const dir = sortDir === "asc" ? 1 : -1;
    listed.sort((a, b) => {
      const av = sortField === "price" ? a.player.askingPrice : a.player[sortField];
      const bv = sortField === "price" ? b.player.askingPrice : b.player[sortField];
      return (av - bv) * dir;
    });
  }

  const activeList = isRecommended ? recommendedList : listed;
  const totalPages = Math.max(1, Math.ceil(activeList.length / MARKET_PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageItems = activeList.slice(clampedPage * MARKET_PAGE_SIZE, (clampedPage + 1) * MARKET_PAGE_SIZE);

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => {
        if (field === "recommended") { setSortField("recommended"); setPage(0); return; }
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
      {label}{field !== "recommended" && sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        {listed.length} players listed across the pyramid — your budget: ${userClub.budget.toLocaleString()}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <SortButton field="recommended" label="★ Recommended" />
        <SortButton field="overall" label="Rating" />
        <SortButton field="potential" label="Potential" />
        <SortButton field="age" label="Age" />
        <SortButton field="askingPrice" label="Price" />
      </div>
      {isRecommended && (
        <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 10, fontStyle: "italic" }}>
          Based on your squad's needs, depth, contract situation, and what you can actually afford — not just raw ratings.
        </div>
      )}
      {isRecommended && recommendedList.length > 0 && (() => {
        // Cumulative affordability: how many of these, taken in order, could
        // you actually sign TOGETHER before running out of budget — not just
        // "is this one individually affordable," which said nothing about
        // whether you could make more than one move.
        let remaining = userClub.budget;
        let affordableCount = 0;
        let totalCost = 0;
        for (const entry of recommendedList) {
          if (entry.player.askingPrice > remaining) break;
          remaining -= entry.player.askingPrice;
          totalCost += entry.player.askingPrice;
          affordableCount++;
        }
        if (affordableCount < 2) return null;
        return (
          <div style={{ background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, ...serif, fontSize: 12.5, color: PALETTE.ink }}>
            💰 You could afford your top {affordableCount} picks here together — ${totalCost.toLocaleString()} total, ${remaining.toLocaleString()} left over.
          </div>
        );
      })()}
      {activeList.length === 0 && (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "12px 0" }}>
          {isRecommended ? "Nothing affordable stands out as a priority signing right now." : "No players listed right now — check back after the next transfer window."}
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
              {isRecommended && (
                <div style={{ fontSize: 11.5, color: PALETTE.gold, marginTop: 2 }}>★ {recommendationReason(player, userClub, xi)}</div>
              )}
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
      {activeList.length > 0 && (
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

function TrophyTab({ trophyLog, bestFinish, currentClubName }) {
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const mutedRed = "#9C6B62"; // on-palette, muted — informational, not alarm-red

  // Relegations only matter as a live warning sign for the club you're
  // currently at — once you've moved on, an old club's relegation is just
  // noise in your own career log, so drop it from History entirely.
  const visibleLog = trophyLog.filter((t) => t.type !== "relegation" || t.clubName === currentClubName);
  const promotions = trophyLog.filter((t) => t.type === "promotion");
  const history = visibleLog.filter((t) => t.type !== "promotion");

  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        Career Highlights
      </div>
      {bestFinish ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}55`, borderRadius: 8, marginBottom: 12 }}>
          <Trophy size={22} color={PALETTE.gold} />
          <div>
            <div style={{ ...display, fontWeight: 700, fontSize: 15, color: PALETTE.ink }}>
              Highest finish: {ordinal(bestFinish.position)} place
            </div>
            <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft }}>
              {TIER_META[bestFinish.tierIdx].name} · Season {bestFinish.season}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, marginBottom: 12 }}>No seasons completed yet.</div>
      )}
      {promotions.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
          <TrendingUp size={18} color={PALETTE.gold} />
          <div style={{ ...serif, fontSize: 13, color: PALETTE.ink }}>
            <span style={{ fontWeight: 700 }}>{t.clubName}</span> — {t.note} (Season {t.season})
          </div>
        </div>
      ))}
      {promotions.length > 0 && <div style={{ height: 16 }} />}

      <div style={{ height: 1, background: PALETTE.parchmentDim, margin: "4px 0 16px" }} />

      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        History
      </div>
      {history.length === 0 ? (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>Nothing here yet — win something.</div>
      ) : (
        [...history].reverse().map((t, i) => {
          const isRelegation = t.type === "relegation";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
              {isRelegation ? <TrendingDown size={18} color={mutedRed} /> : <Award size={18} color={PALETTE.gold} />}
              <div style={{ ...serif, fontSize: 13, color: isRelegation ? mutedRed : PALETTE.ink }}>
                <span style={{ fontWeight: 700 }}>Season {t.season}</span> — {t.clubName ? `${t.clubName} — ` : ""}{t.note}
              </div>
            </div>
          );
        })
      )}
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
                disabled={budget < signCost || club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", cursor: (budget >= signCost && club.youthPlayers.length < ACADEMY_MAX_PROSPECTS) ? "pointer" : "not-allowed",
                  background: (budget >= signCost && club.youthPlayers.length < ACADEMY_MAX_PROSPECTS) ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 600,
                }}
              >
                {club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS ? `Academy Full (${ACADEMY_MAX_PROSPECTS}/${ACADEMY_MAX_PROSPECTS})` : `Sign New Prospect — $${signCost.toLocaleString()}`}
              </button>
            </div>

            {club.youthPlayers.length === 0 ? (
              <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>No prospects yet — sign one to get started.</div>
            ) : (
              <>
                <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 12, marginBottom: 8 }}>
                  {club.youthPlayers.length} / {ACADEMY_MAX_PROSPECTS} prospects
                </div>
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
              </>
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
  { id: "opencup", label: "Open Cup", icon: Star },
  { id: "trophies", label: "Trophy Room", icon: Award },
];

function SackedScreen({ notice, onContinue }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: PALETTE.pitchDark, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ ...display, fontSize: 40, fontWeight: 700, color: PALETTE.crimson, marginBottom: 12 }}>
          You've been sacked
        </div>
        <div style={{ ...serif, fontSize: 15, color: PALETTE.parchment, opacity: 0.85, marginBottom: 8 }}>
          {notice.clubName}'s board has let you go.
        </div>
        <div style={{ ...serif, fontSize: 13, color: PALETTE.parchment, opacity: 0.7, marginBottom: 32 }}>
          {notice.reason}
        </div>
        <button
          onClick={onContinue}
          style={{ background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Find a new club →
        </button>
      </div>
    </div>
  );
}

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

function HintButton({ club, matchday, tier, managerHistory, setManagerHistory }) {
  const [open, setOpen] = useState(false);
  const seenOneTimeHints = managerHistory?.seenOneTimeHints || [];
  const recentForm = tier ? (computeTable(tier).find((r) => r.clubId === club.id)?.form.slice(-5) ?? []) : [];
  const hints = computeHints(club, matchday, seenOneTimeHints, recentForm, tier);
  const urgentCount = hints[0]?.id === "all-clear" ? 0 : hints.length;

  // Mark one-time hints as seen only when the panel CLOSES, not when it
  // opens — marking on open caused the very hints being shown to vanish
  // instantly (computeHints re-runs on the state update and excludes
  // them), so a one-time hint was never actually readable. Recurring,
  // actionable hints (contracts, thin lines, prospects ready) aren't
  // affected and keep coming back as long as they're still true.
  const closeAndMarkSeen = () => {
    const oneTimeIds = hints.filter((h) => h.oneTime).map((h) => h.id);
    if (oneTimeIds.length > 0 && setManagerHistory) {
      setManagerHistory((prev) => ({
        ...prev,
        seenOneTimeHints: Array.from(new Set([...(prev.seenOneTimeHints || []), ...oneTimeIds])),
      }));
    }
    setOpen(false);
  };
  const handleToggle = () => {
    if (open) closeAndMarkSeen();
    else setOpen(true);
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 60 }}>
      {open && (
        <div style={{
          position: "absolute", bottom: 60, right: 0, width: 300, maxHeight: 360, overflowY: "auto",
          background: PALETTE.parchment, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          padding: 16, border: `1px solid ${PALETTE.parchmentDim}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>Hints</span>
            <button onClick={closeAndMarkSeen} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} color={PALETTE.inkSoft} />
            </button>
          </div>
          {hints.map((h) => (
            <div key={h.id} style={{ fontSize: 13, ...serif, color: PALETTE.ink, padding: "8px 0", borderBottom: h.id !== hints[hints.length - 1].id ? `1px solid ${PALETTE.parchmentDim}` : "none" }}>
              {h.text}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleToggle}
        style={{
          width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
          background: PALETTE.gold, color: PALETTE.ink, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.35)", position: "relative",
        }}
        title="Hints"
      >
        <Lightbulb size={22} />
        {urgentCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2, background: PALETTE.crimson, color: "#fff",
            borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", ...mono,
          }}>
            {urgentCount}
          </span>
        )}
      </button>
    </div>
  );
}

const ONBOARDING_STEPS = [
  {
    icon: Trophy,
    title: "Welcome to Ascent",
    body: "You're not playing the matches — you're the manager. You pick the team, set the game plan, buy and sell players, and grow young talent. The matches themselves play out on their own once you've made your calls. Skip this anytime with the link below.",
  },
  {
    icon: TrendingUp,
    title: "The Pyramid",
    body: "American soccer is stacked in four tiers: MLS at the top, then USL Championship, USL League One, and USL League Two at the bottom. Finish near the top of your tier and you move UP a tier next season. Finish near the bottom and you get sent DOWN. Win it all in the top tier and you're the champion of American soccer.",
  },
  {
    icon: Users,
    title: "Running your club",
    body: "Squad is your full roster — set your captain and pick a lineup mode. Tactics is your game plan (formation, style, press) for the next match — set this well and it actually changes how matches play out. Market is where you buy and sell players. Development lets you grow young talent through an academy or tryouts.",
  },
  {
    icon: Lightbulb,
    title: "If you're ever stuck",
    body: "The gold button in the corner gives you concrete suggestions any time you're not sure what to do. The Market has a ★ Recommended tab built around your squad's actual needs. Tactics has a \"Suggested for your squad\" box. None of this is guesswork you have to do alone.",
  },
  {
    icon: Trophy,
    title: "Pick your difficulty",
    body: "One last thing before you start. Each mode isn't just harder — it asks a different question of you.",
    isDifficultyStep: true,
  },
];

// Shown once per manager (skippable), not once per career — so starting a
// new club after being sacked or retiring doesn't re-trigger the whole
// walkthrough every time.
function OnboardingGuide({ onFinish }) {
  const [step, setStep] = useState(0);
  const isLast = step === ONBOARDING_STEPS.length - 1;
  const current = ONBOARDING_STEPS[step];
  const Icon = current.icon;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 480, width: "100%", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Icon size={24} color={PALETTE.gold} />
          <div style={{ ...display, fontSize: 20, fontWeight: 700, color: PALETTE.ink }}>{current.title}</div>
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, lineHeight: 1.5, marginBottom: 20 }}>
          {current.body}
        </div>

        {current.isDifficultyStep && (
          <div style={{ background: "#E4D9C4", borderRadius: 8, padding: "10px 14px", marginBottom: 16, ...serif, fontSize: 12.5, color: PALETTE.ink, lineHeight: 1.35 }}>
            <div style={{ marginBottom: 5 }}><strong>Rookie</strong> — no wages, no board. Think like a coach: just pick the team and get results. <em>Start here if you're new.</em></div>
            <div style={{ marginBottom: 5 }}><strong>Pro</strong> — real wages, real bonuses. Think like a budget-conscious manager: don't let payroll outrun income.</div>
            <div><strong>Executive</strong> — adds a board with objectives, sacking risk, and Designated Players. Think like a real GM: balance short-term pressure against long-term reputation.</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <button
            onClick={onFinish}
            style={{ background: "none", border: "none", color: PALETTE.inkSoft, fontSize: 13, cursor: "pointer", ...serif, textDecoration: "underline" }}
          >
            Skip tutorial
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: PALETTE.inkSoft, ...mono }}>{step + 1} / {ONBOARDING_STEPS.length}</span>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                style={{ padding: "10px 16px", borderRadius: 6, border: `1px solid ${PALETTE.parchmentDim}`, background: "none", color: PALETTE.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
              style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
            >
              {isLast ? "Start managing →" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayrollOverlay({ club, difficulty, tierIdx, onClose }) {
  const payroll = effectivePayroll(club.squad, club.designatedPlayerIds);
  const projected = club.budget - payroll;
  const dpCount = (club.designatedPlayerIds || []).length;
  const capApplies = tierIdx === 0 && DIFFICULTY_MODES[difficulty]?.dps;
  const capRoom = MLS_SALARY_CAP - payroll;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 55, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 380, width: "100%", padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 18, fontWeight: 700, color: PALETTE.ink, marginBottom: 14 }}>
          Payroll — {club.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Current budget</span>
          <strong>${club.budget.toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Squad wage bill ({club.squad.length} players{dpCount > 0 ? `, ${dpCount} DP` : ""})</span>
          <strong>-${payroll.toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Room left after next payroll</span>
          <strong style={{ color: projected < 0 ? PALETTE.crimson : PALETTE.ink }}>${projected.toLocaleString()}</strong>
        </div>
        {projected < 0 && (
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.crimson, marginTop: 6 }}>
            Your wage bill outruns your budget — you'll go into debt at the next payroll unless you free up salary or bring in revenue first.
          </div>
        )}
        {capApplies && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", marginTop: 8, borderTop: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
            <span style={{ color: PALETTE.inkSoft }}>Salary cap room (${MLS_SALARY_CAP.toLocaleString()} cap)</span>
            <strong style={{ color: capRoom < 0 ? PALETTE.crimson : PALETTE.ink }}>${capRoom.toLocaleString()}</strong>
          </div>
        )}
        <button onClick={onClose} style={{ width: "100%", marginTop: 16, background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Close
        </button>
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

// Per-win bonus paid directly into a club's budget on Pro/Executive — real
// figures scale down tier by tier; League Two is amateur and pays nothing.
const WIN_BONUS = [7_500, 3_000, 1_500, 0];

// Well-documented real rivalries — kept to pairs that are unambiguous and
// widely recognized, rather than guessing at anything less certain.
const RIVALRIES = [
  ["Portland Timbers", "Seattle Sounders FC"], // Cascadia Cup
  ["Portland Timbers", "Vancouver Whitecaps FC"], // Cascadia Cup
  ["Seattle Sounders FC", "Vancouver Whitecaps FC"], // Cascadia Cup
  ["LA Galaxy", "Los Angeles FC"], // El Tráfico
  ["New York City FC", "New York Red Bulls"], // Hudson River Derby
  ["Real Salt Lake", "Colorado Rapids"], // Rocky Mountain Cup
  ["Toronto FC", "CF Montréal"], // Canadian Classique
  ["Louisville City FC", "Indy Eleven"], // I-64 Derby
  // Texas Triangle / Copa Tejas — three-way rivalry between all of MLS's Texas clubs
  ["FC Dallas", "Houston Dynamo FC"], // the original Texas Derby within the triangle
  ["FC Dallas", "Austin FC"],
  ["Houston Dynamo FC", "Austin FC"],
  // Corrected — this was previously mislabeled with the wrong two clubs.
  // The real Brimstone Cup is FC Dallas vs Chicago Fire FC, contested
  // since 2001.
  ["FC Dallas", "Chicago Fire FC"], // Brimstone Cup
  ["FC Dallas", "Columbus Crew"], // Lamar Hunt Pioneer Cup
  ["New York Red Bulls", "D.C. United"], // Atlantic Cup
  ["LA Galaxy", "San Jose Earthquakes"], // California Clásico
  ["Columbus Crew", "FC Cincinnati"], // Hell Is Real derby
  ["Seattle Sounders FC", "San Jose Earthquakes"], // Heritage Cup
  ["Sporting Kansas City", "St. Louis City SC"], // Midwest expansion-era rivalry
  ["D.C. United", "New England Revolution"],
  ["D.C. United", "Philadelphia Union"],
  ["Inter Miami CF", "Orlando City SC"], // Florida Derby
  ["CF Montréal", "Vancouver Whitecaps FC"], // cross-country, rooted in pre-MLS Canadian competitions
];
const RIVALRY_PAIRS = new Set(RIVALRIES.map(([a, b]) => [a, b].sort().join("|")));
function isRivalryMatch(nameA, nameB) {
  return RIVALRY_PAIRS.has([nameA, nameB].sort().join("|"));
}
const RIVALRY_REVENUE_BONUS = 25_000; // extra gate revenue for a derby, Pro/Executive only
const RIVALRY_REPUTATION_BUMP = 1; // small, so it doesn't dwarf the season-long reputation system

function simulateMatchdayAcrossTiers(next, currentMatchday) {
  const matches = [];
  let disqualificationNotice = null;
  const eventBonusesOn = DIFFICULTY_MODES[next.difficulty]?.eventBonuses;
  next.tiers.forEach((t) => {
    // recovery between matchdays for the whole squad — starters net a small
    // amount of fatigue, rested players climb back toward full fitness
    t.clubs.forEach((c) => c.squad.forEach((p) => { p.fitness = clamp(p.fitness + 18, 0, 100); }));

    const todays = t.fixtures.filter((f) => f.matchday === currentMatchday && !f.played);
    todays.forEach((fx) => {
      const home = t.clubs.find((c) => c.id === fx.homeClubId);
      const away = t.clubs.find((c) => c.id === fx.awayClubId);
      if (!home || !away) return;
      // A disqualified club can't field a real side — the fixture still
      // happens on the calendar, but resolves as an automatic loss rather
      // than going through full simulation (which assumes 11+ fit players).
      if (home.disqualified || away.disqualified) {
        const homeLoses = home.disqualified;
        fx.homeScore = homeLoses ? 0 : 3;
        fx.awayScore = homeLoses ? 3 : 0;
        fx.played = true;
        home.squad.forEach((p) => { p.restRequested = false; });
        away.squad.forEach((p) => { p.restRequested = false; });
        const result = { homeClub: home.name, awayClub: away.name, homeScore: fx.homeScore, awayScore: fx.awayScore, events: [], disqualifiedMatch: true };
        if (t.id === next.userTierId) matches.push(result);
        return;
      }
      const result = simulateMatch(fx, home, away, currentMatchday, next.difficulty);
      if (eventBonusesOn && WIN_BONUS[t.id] > 0) {
        if (fx.homeScore > fx.awayScore) home.budget += WIN_BONUS[t.id];
        else if (fx.awayScore > fx.homeScore) away.budget += WIN_BONUS[t.id];
      }
      // Rivalry matches — a small reputation bump for the winner always
      // applies (bragging rights matter regardless of difficulty), while
      // the extra gate revenue only makes sense once revenue is actually
      // tracked (Pro/Executive).
      // A rivalry match gets flagged regardless of result — a draw still
      // deserves the recap/badge treatment, it just doesn't earn anyone
      // the reputation/revenue bump (there's no winner to give it to).
      if (isRivalryMatch(home.name, away.name)) {
        result.isRivalryMatch = true;
        if (fx.homeScore !== fx.awayScore) {
          const winner = fx.homeScore > fx.awayScore ? home : away;
          winner.reputation = clamp(winner.reputation + RIVALRY_REPUTATION_BUMP, 20, 95);
          if (eventBonusesOn) winner.budget += RIVALRY_REVENUE_BONUS;
        }
      }
      if (t.id === next.userTierId) matches.push(result);
    });
    // light responsiveness pass: an already-listed player might get snapped up between windows.
    // The previous bump (8% → 14/22%) fixed slow user sales but had an
    // unintended side effect: compounded across ~34 matchdays in a season,
    // it wiped out nearly the ENTIRE market pool by season's end (229
    // listed dropping to just 7 by the time the user checked). Rolled back
    // to a rate that keeps the market meaningfully populated all season —
    // AI-to-AI listings turn over gradually rather than nearly all clearing
    // out — while still keeping the user's own listings selling reliably
    // within a season, which was the actual point of the original fix.
    t.clubs.forEach((seller) => {
      const isUserSeller = seller.id === next.userClubId;
      seller.squad.forEach((p) => {
        // Same distinction as the preseason window: an unhappy player
        // auto-listed from being benched isn't a listing the user actually
        // chose to make, so it shouldn't move at the fast voluntary-sale
        // rate — that compounding across many matchdays in one bulk sim
        // (Sim to Next Window, Sim Season) is what could suddenly gut a
        // squad below the minimum with no real say from the user.
        const buyChance = isUserSeller ? (p.transferRequested ? 0.03 : 0.1) : 0.025;
        if (p.transferListed && Math.random() < buyChance) {
          // The user's own club must never be randomly picked as the
          // "AI" buyer here — this was silently signing random players
          // onto the user's squad (and spending their budget) with no
          // action or consent from them at all.
          const buyers = t.clubs.filter((c) => c.id !== seller.id && c.id !== next.userClubId && c.budget >= p.askingPrice && c.squad.length < MAX_SQUAD_SIZE);
          if (buyers.length === 0) return;
          const buyer = choice(buyers);
          buyer.budget -= p.askingPrice;
          seller.budget += p.askingPrice;
          p.transferListed = false;
          p.askingPrice = null;
          p.benchStreak = 0;
          p.transferRequested = false;
          seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
          if (seller.designatedPlayerIds?.includes(p.id)) {
            seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== p.id);
          }
          buyer.squad.push(p);
        }
      });
    });

    // A sale (or an AI club selling into the user's squad edge cases) can
    // drop a club below the minimum playable squad size mid-season — check
    // every club after this matchday's activity and flag/fund accordingly.
    t.clubs.forEach((club, idx) => {
      const { club: updated, notice } = applyDisqualificationCheck(club, t.id);
      if (updated !== club) t.clubs[idx] = updated;
      if (notice && club.id === next.userClubId) disqualificationNotice = notice;
    });
  });
  return { matches, disqualificationNotice };
}

function maybeTriggerMidWindow(next, justPlayedMatchday) {
  if (justPlayedMatchday !== MID_SEASON_WINDOW_MATCHDAY - 1) return null;
  if (next.midWindowSeason === next.seasonNumber) return null;
  const result = runTransferWindow(next.tiers, next.userClubId);
  next.midWindowSeason = next.seasonNumber;
  return result;
}

function Dashboard({ state, setState, onNewGame, onSacked, managerHistory, setManagerHistory }) {
  const [tab, setTab] = useState("squad");
  const [recap, setRecap] = useState(null);
  const [windowNotice, setWindowNotice] = useState(null);
  const [rollover, setRollover] = useState(null);
  const [renewalNotice, setRenewalNotice] = useState(null);
  const [draftPicks, setDraftPicks] = useState(null);
  const [infoNotice, setInfoNotice] = useState(null);
  const [seasonPlayoffs, setSeasonPlayoffs] = useState(null);
  const [revealedRounds, setRevealedRounds] = useState(0);
  const [cupRecap, setCupRecap] = useState(null);
  const [rivalryRecap, setRivalryRecap] = useState(null);
  const [sackedNotice, setSackedNotice] = useState(null);
  const [showPayroll, setShowPayroll] = useState(false);

  const tier = state.tiers[state.userTierId];
  const userClub = tier.clubs.find((c) => c.id === state.userClubId);
  const nextMatchdayFixtures = tier.fixtures.filter((f) => !f.played);
  const currentMatchday = nextMatchdayFixtures.length > 0 ? nextMatchdayFixtures[0].matchday : null;
  const seasonComplete = currentMatchday === null;

  // Board expectations were previously only visible buried in the Squad tab
  // — surface them explicitly the moment a new job starts under board
  // pressure, same way a real new manager gets told what's expected of them
  // in the first meeting with ownership.
  useEffect(() => {
    if (DIFFICULTY_MODES[state.difficulty]?.boardPressure && state.seasonNumber === 1 && userClub.boardObjective) {
      setInfoNotice(`Welcome to ${userClub.name}. The board's expectation this season: ${userClub.boardObjective.description}.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutateAndSave = useCallback((mutator) => {
    setState((prev) => {
      const next = { ...prev, tiers: prev.tiers.map((t) => ({ ...t, clubs: t.clubs.map((c) => ({ ...c, squad: [...c.squad] })), fixtures: [...t.fixtures] })) };
      mutator(next);
      return next;
    });
  }, [setState]);

  const findUserRivalryMatch = (matches) => matches.find((m) => m.isRivalryMatch && (m.homeClub === userClub.name || m.awayClub === userClub.name));

  const simulateMatchday = () => {
    if (currentMatchday === null) return;
    if (pendingCupRoundIndex !== null) {
      // Auto-resolve the cup round in place rather than force-navigating
      // to the Open Cup tab — that was an intrusive interruption,
      // especially now that the Fixtures tab already surfaces the
      // upcoming cup round and your drawn opponent ahead of time. The
      // match summary for your own cup game still pops up either way.
      mutateAndSave((next) => {
        const newRound = resolveCupRoundInPlace(next);
        const match = findUserCupMatch(newRound);
        if (match) setCupRecap({ roundLabel: newRound.label, match });
      });
      return;
    }
    mutateAndSave((next) => {
      const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, currentMatchday);
      const w = maybeTriggerMidWindow(next, currentMatchday);
      setRecap({ matchday: currentMatchday, matches });
      if (w) setWindowNotice(w);
      if (disqualificationNotice) {
        setInfoNotice(disqualificationNotice.resolved
          ? `${disqualificationNotice.clubName} is back above the minimum squad size — disqualification lifted, you're clear to compete normally again.`
          : `${disqualificationNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum (short ${disqualificationNotice.short}) — you're disqualified from competing until you sign back up to strength. Emergency funding of $${disqualificationNotice.funding.toLocaleString()} has been added to your budget to help.`);
      }
      const userRivalry = findUserRivalryMatch(matches);
      if (userRivalry) {
        setRivalryRecap({ homeClub: userRivalry.homeClub, awayClub: userRivalry.awayClub, homeScore: userRivalry.homeScore, awayScore: userRivalry.awayScore, userIsHome: userRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const simulateSeason = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      let lastNotice = null;
      let lastUserCupMatch = null;
      let lastUserRivalry = null;
      while (md !== null) {
        if (isCupCheckpointPending(next, md)) {
          const newRound = resolveCupRoundInPlace(next);
          const match = findUserCupMatch(newRound);
          if (match) lastUserCupMatch = { roundLabel: newRound.label, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, md);
        if (disqualificationNotice) lastNotice = disqualificationNotice;
        const userRivalry = findUserRivalryMatch(matches);
        if (userRivalry) lastUserRivalry = userRivalry;
        maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
      }
      if (lastNotice) {
        setInfoNotice(lastNotice.resolved
          ? `${lastNotice.clubName} is back above the minimum squad size at some point this run — disqualification lifted.`
          : `${lastNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum during this run — you're disqualified from competing until you sign back up to strength. Emergency funding of $${lastNotice.funding.toLocaleString()} has been added to your budget to help.`);
      } else if (lastUserCupMatch) {
        setCupRecap(lastUserCupMatch);
      } else if (lastUserRivalry) {
        setRivalryRecap({ homeClub: lastUserRivalry.homeClub, awayClub: lastUserRivalry.awayClub, homeScore: lastUserRivalry.homeScore, awayScore: lastUserRivalry.awayScore, userIsHome: lastUserRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const simulateToNextWindow = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      let fired = null;
      let lastNotice = null;
      let lastUserCupMatch = null;
      let lastUserRivalry = null;
      while (md !== null) {
        if (isCupCheckpointPending(next, md)) {
          const newRound = resolveCupRoundInPlace(next);
          const match = findUserCupMatch(newRound);
          if (match) lastUserCupMatch = { roundLabel: newRound.label, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, md);
        if (disqualificationNotice) lastNotice = disqualificationNotice;
        const userRivalry = findUserRivalryMatch(matches);
        if (userRivalry) lastUserRivalry = userRivalry;
        fired = maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
        if (fired) break;
      }
      setWindowNotice(fired ? fired : { seasonEnded: true });
      if (lastNotice) {
        setInfoNotice(lastNotice.resolved
          ? `${lastNotice.clubName} is back above the minimum squad size — disqualification lifted.`
          : `${lastNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum — you're disqualified from competing until you sign back up to strength. Emergency funding of $${lastNotice.funding.toLocaleString()} has been added to your budget to help.`);
      } else if (lastUserCupMatch) {
        setCupRecap(lastUserCupMatch);
      } else if (lastUserRivalry) {
        setRivalryRecap({ homeClub: lastUserRivalry.homeClub, awayClub: lastUserRivalry.awayClub, homeScore: lastUserRivalry.homeScore, awayScore: lastUserRivalry.awayScore, userIsHome: lastUserRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const handleViewPostseason = () => {
    try {
      setSeasonPlayoffs(computeSeasonPlayoffs(state.tiers, state.userClubId, state.difficulty));
      setRevealedRounds(0);
      setTab("table");
    } catch (e) {
      setInfoNotice(`Something went wrong computing the postseason (${e.message}). You can still continue to next season — the regular rollover doesn't depend on this.`);
    }
  };

  const handleSimRound = () => setRevealedRounds((r) => Math.min(MAX_POSTSEASON_ROUNDS, r + 1));
  const handleSimRestOfPostseason = () => setRevealedRounds(MAX_POSTSEASON_ROUNDS);

  // Pops up the user's own cup match once their round is played — same
  // idea as the regular-season matchday recap. Once they lose, they no
  // longer appear in any later round's matches, so this naturally stops
  // popping up without needing separate "eliminated" state.
  const findUserCupMatch = (round) => round.matches.find((m) => m.homeEntrant.club.id === state.userClubId || m.awayEntrant.club.id === state.userClubId);

  // The cup now runs DURING the season: a specific league matchday number
  // comes due, and instead of playing that league matchday, this round
  // of the cup plays first. Nothing else advances until it's done.
  const pendingCupRoundIndex = currentMatchday !== null && isCupCheckpointPending(state, currentMatchday)
    ? US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(currentMatchday)
    : null;

  // The pairing for a cup round is random — drawing it fresh every render
  // would show a different "next opponent" each time. Draw it once, the
  // moment the round becomes due, and store it so the preview stays
  // stable until the round is actually played (which reuses this exact
  // pairing rather than redrawing).
  useEffect(() => {
    if (pendingCupRoundIndex === null) return;
    const existingDraw = state.usOpenCup?.pendingDraw;
    if (existingDraw && existingDraw.roundIndex === pendingCupRoundIndex) return;
    mutateAndSave((next) => {
      const draw = drawNextUsOpenCupRound(next.usOpenCup, next.tiers, next.usOpenCupQualifiers);
      next.usOpenCup = next.usOpenCup
        ? { ...next.usOpenCup, pendingDraw: draw }
        : { rounds: [], giantKillerBonuses: [], pool: null, done: false, champion: null, runnerUp: null, pendingDraw: draw };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCupRoundIndex]);

  const handlePlayCupRound = () => {
    mutateAndSave((next) => {
      const newRound = resolveCupRoundInPlace(next);
      const match = findUserCupMatch(newRound);
      if (match) setCupRecap({ roundLabel: newRound.label, match });
    });
  };

  const doRollover = () => {
    const { newTiers, events, tables, windowResult, newPrizePools, userPrize, userRetirements, userDraftPicks, userPayroll, mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, userPromotionPlayoff, userDisqualificationNotice, userDpRevenue, seasonAwards } = rolloverSeason(state.tiers, state.userClubId, state.prizePools, state.difficulty, seasonPlayoffs);
    // The US Open Cup already ran and paid out mid-season (see
    // handlePlayCupRound) — this is just a historical recap for the
    // season summary, not a fresh payout.
    const cup = state.usOpenCup;
    let userUsOpenCup = null;
    if (cup?.done) {
      const userGiantKillerWins = cup.giantKillerBonuses.filter((g) => g.clubId === state.userClubId).length;
      if (state.userClubId === cup.champion.club.id) userUsOpenCup = { result: "champion", giantKillerWins: userGiantKillerWins };
      else if (state.userClubId === cup.runnerUp.club.id) userUsOpenCup = { result: "runner-up", giantKillerWins: userGiantKillerWins };
      else if (userGiantKillerWins > 0) userUsOpenCup = { result: "giant-killer", giantKillerWins: userGiantKillerWins };
    }
    const userMove = events.find((e) => e.clubId === state.userClubId && e.type !== "champion");
    const userChamp = events.find((e) => e.clubId === state.userClubId && e.type === "champion");
    const currentClubName = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId)?.name ?? "";
    const trophyEntries = [];
    if (userChamp) {
      const shieldNote = userChamp.tier === 0 ? "Won the Supporters' Shield (best regular-season record)"
        : userChamp.tier === 1 ? "Won the Players' Shield (best regular-season record)"
        : `Won the ${TIER_META[userChamp.tier].name} title`;
      trophyEntries.push({ season: state.seasonNumber, note: shieldNote, type: "trophy", clubName: currentClubName });
    }
    if (userMove) trophyEntries.push({
      season: state.seasonNumber,
      note: userMove.type === "promoted" ? `Promoted to ${TIER_META[userMove.to].name}` : `Relegated to ${TIER_META[userMove.to].name}`,
      type: userMove.type === "promoted" ? "promotion" : "relegation",
      clubName: currentClubName,
    });
    if (userMlsPlayoff?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the MLS Cup", type: "trophy", clubName: currentClubName });
    else if (userMlsPlayoff?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "MLS Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userUslcPlayoff?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the USL Cup", type: "trophy", clubName: currentClubName });
    else if (userUslcPlayoff?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "USL Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userUsOpenCup?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the US Open Cup", type: "trophy", clubName: currentClubName });
    else if (userUsOpenCup?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "US Open Cup runner-up", type: "trophy", clubName: currentClubName });

    // Track the best league finish this manager has ever recorded, across
    // every club and every tier — permanent career history, not tied to
    // whichever club you're currently at.
    const userTable = tables[state.userTierId];
    const position = userTable.findIndex((r) => r.clubId === state.userClubId) + 1;
    const isBetter = !managerHistory.bestFinish
      || position < managerHistory.bestFinish.position
      || (position === managerHistory.bestFinish.position && state.userTierId < managerHistory.bestFinish.tierIdx);
    const bestFinish = isBetter ? { position, tierIdx: state.userTierId, season: state.seasonNumber } : managerHistory.bestFinish;

    // Board pressure — Executive mode only. Evaluate the objective the board
    // set last time, move happiness accordingly, and set the next one.
    let sackNotice = null;
    let boardNotice = null;
    const nextTierIdx = userMove ? userMove.to : state.userTierId;
    if (DIFFICULTY_MODES[state.difficulty]?.boardPressure) {
      const userClubPre = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId);
      const currentObjective = userClubPre.boardObjective;
      const userClubPost = newTiers[nextTierIdx].clubs.find((c) => c.id === state.userClubId);
      const debt = userClubPost.budget < 0 ? -userClubPost.budget : 0;
      // Running a deficit already costs a flat -10 via boardHappinessDelta,
      // but a real board is far more forgiving of a small overspend than a
      // genuine crisis — scale an extra penalty with how deep the debt
      // actually runs, and let it factor meaningfully into getting sacked.
      const debtPenalty = debt > 0 ? Math.min(20, Math.round(debt / 500_000)) : 0;
      const delta = boardHappinessDelta(currentObjective, position, userMove?.type === "relegated", userMove?.type === "promoted", userClubPost.budget) - debtPenalty;
      let newHappiness = clamp((userClubPre.boardHappiness ?? 60) + delta, 0, 100);
      const sacked = newHappiness <= SACK_THRESHOLD;

      // Danger zone: happiness has dropped low enough to be a real concern
      // but not low enough to be sacked yet. Real boards don't just silently
      // wait it out here — some stay patient and back the manager with extra
      // funds to try to fix things, others make clear this is a last chance.
      // Being in actual debt always earns a roll here too, even if happiness
      // hasn't cratered yet — a board notices red ink long before a mid-table
      // finish becomes a happiness problem.
      const DANGER_ZONE_THRESHOLD = 30;
      let emergencyFunding = 0;
      if (!sacked && (newHappiness <= DANGER_ZONE_THRESHOLD || debt > 0)) {
        const boardIsPatient = Math.random() < 0.4;
        if (boardIsPatient) {
          const depositScale = ownershipDepositFor(nextTierIdx, state.difficulty);
          const standardFunding = Math.round(depositScale * (0.25 + Math.random() * 0.15));
          // if there's real debt, make sure the bailout actually covers a
          // meaningful chunk of it rather than being a token gesture
          emergencyFunding = debt > 0 ? Math.max(standardFunding, Math.round(debt * 0.6)) : standardFunding;
          newHappiness = clamp(newHappiness + 5, 0, 100);
          boardNotice = debt > 0
            ? `The board convened over the club's finances — ${userClubPre.name} is $${debt.toLocaleString()} in debt. They've agreed to inject $${emergencyFunding.toLocaleString()} to help dig out, but they expect the books back in order soon.`
            : `The board held an emergency meeting about results at ${userClubPre.name}. They've decided to stay patient for now and back you with an extra $${emergencyFunding.toLocaleString()} for the squad — but they'll expect to see it turn around.`;
        } else {
          boardNotice = debt > 0
            ? `The board is alarmed by ${userClubPre.name}'s finances — $${debt.toLocaleString()} in debt — and isn't stepping in to cover it. Sort the budget out yourself, or it'll cost you your job.`
            : `The board held an emergency meeting about results at ${userClubPre.name}. They're not pulling the plug yet, but make no mistake — this is a final warning. Turn it around, or you're out.`;
        }
      }

      const nextObjective = generateBoardObjective(userClubPre.reputation, nextTierIdx, newTiers[nextTierIdx].clubs);
      const idx = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idx >= 0) {
        newTiers[nextTierIdx].clubs[idx] = {
          ...newTiers[nextTierIdx].clubs[idx],
          boardHappiness: newHappiness,
          boardObjective: nextObjective,
          budget: newTiers[nextTierIdx].clubs[idx].budget + emergencyFunding,
        };
      }
      if (sacked) {
        sackNotice = {
          clubName: userClubPre.name,
          reason: currentObjective ? `The board wanted: ${currentObjective.description}. You finished ${position}${position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th"}.` : "The board has lost confidence in your management.",
        };
      }
    } else if (DIFFICULTY_MODES[state.difficulty]?.wagesDeducted) {
      // Pro mode — no board to answer to, but a club still can't be left to
      // spiral into unmanageable debt indefinitely. Ownership automatically
      // covers part of any shortfall; the rest is on the manager to fix.
      const idx = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idx >= 0) {
        const club = newTiers[nextTierIdx].clubs[idx];
        if (club.budget < 0) {
          const debt = -club.budget;
          const relief = Math.round(debt * 0.6);
          newTiers[nextTierIdx].clubs[idx] = { ...club, budget: club.budget + relief };
          const remaining = debt - relief;
          boardNotice = `Ownership stepped in to cover part of the shortfall — a $${relief.toLocaleString()} injection lands after payroll, but you're still $${remaining.toLocaleString()} in the red. Rein in spending before it happens again.`;
        }
      }
    }

    if (userDisqualificationNotice) {
      const dqText = userDisqualificationNotice.resolved
        ? `${userDisqualificationNotice.clubName} is back above the ${MIN_SQUAD_SIZE}-player minimum — disqualification lifted, you're clear to compete normally again.`
        : `${userDisqualificationNotice.clubName} enters the new season short ${userDisqualificationNotice.short} player${userDisqualificationNotice.short === 1 ? "" : "s"} of the ${MIN_SQUAD_SIZE}-player minimum — you're disqualified from competing until you sign back up to strength. Emergency funding of $${userDisqualificationNotice.funding.toLocaleString()} has been added to your budget to help.`;
      boardNotice = boardNotice ? `${boardNotice}\n\n${dqText}` : dqText;
    }

    // The trophy case belongs to the manager, not the club — record this
    // season's results either way, sacked or not.
    setManagerHistory((prev) => ({
      trophyLog: [...prev.trophyLog, ...trophyEntries],
      bestFinish,
    }));

    if (sackNotice) {
      setSackedNotice(sackNotice);
      setSeasonPlayoffs(null);
    setRevealedRounds(0);
      return;
    }

    // Loan returns — anyone due back this season rejoins the squad (if
    // there's room), having developed a bit extra for the time away.
    const nextSeasonNumber = state.seasonNumber + 1;
    const stillOnLoan = [];
    const userNewTierId = userMove ? userMove.to : state.userTierId;
    const userClubAfterMove = newTiers[userNewTierId].clubs.find((c) => c.id === state.userClubId);
    (state.playersOnLoan || []).forEach((entry) => {
      if (entry.returnSeasonNumber !== nextSeasonNumber) { stillOnLoan.push(entry); return; }
      if (userClubAfterMove && userClubAfterMove.squad.length < MAX_SQUAD_SIZE) {
        const developed = growPlayer(growPlayer(entry.player)); // an extra development pass, on top of what everyone else already gets this rollover
        userClubAfterMove.squad.push({ ...developed, seasonGoals: 0, benchStreak: 0 });
      } else {
        stillOnLoan.push(entry); // squad's full — stay out one more season
      }
    });

    setState((prev) => ({
      ...prev,
      tiers: newTiers,
      userTierId: userMove ? userMove.to : prev.userTierId,
      seasonNumber: prev.seasonNumber + 1,
      midWindowSeason: prev.midWindowSeason,
      prizePools: newPrizePools,
      // US Open Cup qualification is based on the PREVIOUS season's final
      // standings, same as the real tournament (not whatever's happening
      // in-progress this season) — bank this season's final top-16
      // USLC / bottom-16 MLS now, for next season's cup rounds to use.
      usOpenCupQualifiers: {
        uslcTop16: tables[1].slice(0, 16).map((r) => r.clubId),
        mlsBottom16: tables[0].slice(-16).map((r) => r.clubId),
      },
      usOpenCup: null,
      playersOnLoan: stillOnLoan,
    }));
    setRollover({ events, seasonNumber: state.seasonNumber, windowResult, userPrize, ownershipDeposit: ownershipDepositFor(state.userTierId, state.difficulty), userRetirements, userPayroll, mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, userPromotionPlayoff, boardNotice, userDpRevenue, usOpenCup: cup, userUsOpenCup, seasonAwards });
    if (userDraftPicks && userDraftPicks.length) setDraftPicks(userDraftPicks);
    setSeasonPlayoffs(null);
    setRevealedRounds(0);
  };

  const handleToggleList = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      p.transferListed = !p.transferListed;
      p.askingPrice = p.transferListed ? marketValue(p) : null;
      if (!p.transferListed && p.transferRequested) {
        // Un-listing an unhappy player is treated as the manager
        // addressing it (a promise of more game time) — clear the
        // complaint rather than leaving the "wants out" badge stuck
        // forever with no way to resolve it.
        p.transferRequested = false;
        p.benchStreak = 0;
      }
    });
  };

  const handleRenew = (playerId) => {
    const p = userClub.squad.find((pl) => pl.id === playerId);
    if (p && state.userTierId === 0 && DIFFICULTY_MODES[state.difficulty]?.dps) {
      const isDp = (userClub.designatedPlayerIds || []).includes(p.id);
      if (!isDp) {
        const newWage = Math.round(p.wage * 1.1);
        const otherNonDpWages = effectivePayroll(userClub.squad.filter((sp) => sp.id !== p.id), userClub.designatedPlayerIds);
        if (otherNonDpWages + newWage > MLS_SALARY_CAP) {
          setInfoNotice(`Renewing ${p.name} at $${newWage.toLocaleString()}/season would push you over the $${MLS_SALARY_CAP.toLocaleString()} salary cap. Make them a Designated Player first, or free up cap room elsewhere.`);
          return;
        }
      }
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const pl = club.squad.find((pl) => pl.id === playerId);
      if (!pl) return;
      const outcome = renewalOutcome(pl, club.budget);
      if (!outcome.accepted) {
        setRenewalNotice({ playerName: pl.name, accepted: false, reason: outcome.reason, cost: outcome.cost });
        return;
      }
      club.budget -= outcome.cost;
      pl.contractYearsLeft += 2;
      pl.wage = Math.round(pl.wage * 1.1);
      pl.wageSet = true;
      setRenewalNotice({ playerName: pl.name, accepted: true, cost: outcome.cost });
    });
  };

  const handleSetCaptain = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.captainId = playerId;
    });
  };

  const handleToggleDP = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const current = club.designatedPlayerIds || [];
      if (current.includes(playerId)) {
        club.designatedPlayerIds = current.filter((id) => id !== playerId);
      } else if (current.length < MAX_DESIGNATED_PLAYERS) {
        club.designatedPlayerIds = [...current, playerId];
        // A marquee DP signing raises what people expect of the club —
        // reputation only ratchets up from this, never down, so cutting a
        // DP later isn't retroactively punished.
        club.reputation = clamp(club.reputation + DP_REPUTATION_BUMP, 20, 95);
      }
    });
  };

  const handleToggleRest = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (p) p.restRequested = !p.restRequested;
    });
  };

  const handleToggleHoldBack = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (p) p.holdBackForCup = !p.holdBackForCup;
    });
  };

  // Loans keep it simple by design — no need to simulate them playing for
  // another club match by match. They leave the squad for the season, a
  // modest fee lands now, and they come back next season a little further
  // along than they'd have developed sitting on the bench.
  const handleLoanOut = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (!p) return;
      const fee = Math.round(1_000 * Math.pow(1.08, p.overall));
      club.budget += fee;
      club.squad = club.squad.filter((pl) => pl.id !== playerId);
      if (club.designatedPlayerIds?.includes(playerId)) {
        club.designatedPlayerIds = club.designatedPlayerIds.filter((id) => id !== playerId);
      }
      next.playersOnLoan = [...(next.playersOnLoan || []), { player: p, returnSeasonNumber: next.seasonNumber + 1 }];
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
    // Real salary cap check (MLS + Executive only, where DPs exist): a new
    // signing joins as a non-DP by default, so if their wage would push
    // the non-DP wage bill over the cap, the move is blocked — free a DP
    // slot for them, offload some existing wage, or pass.
    if (state.userTierId === 0 && DIFFICULTY_MODES[state.difficulty]?.dps) {
      const sourceTier = state.tiers[sellerTierId] ?? state.tiers.find((t) => t.clubs.some((c) => c.id === sellerId));
      const seller = sourceTier?.clubs.find((c) => c.id === sellerId);
      const p = seller?.squad.find((pl) => pl.id === playerId);
      if (p) {
        const currentNonDpWages = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
        if (currentNonDpWages + p.wage > MLS_SALARY_CAP) {
          setInfoNotice(`Signing ${p.name} at a $${p.wage.toLocaleString()} wage would push you over the $${MLS_SALARY_CAP.toLocaleString()} salary cap. Free up a Designated Player slot for them, offload some existing wages first, or look elsewhere.`);
          return;
        }
      }
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
      // A fresh start at a new club — whatever bench frustration or
      // transfer-request history they had at their old club doesn't carry
      // over. Otherwise a player who'd built up bench streak elsewhere
      // could trigger "unhappy" again almost immediately after being
      // bought, before they'd even had a real chance to play here.
      p.benchStreak = 0;
      p.transferRequested = false;
      seller.squad = seller.squad.filter((pl) => pl.id !== playerId);
      if (seller.designatedPlayerIds?.includes(playerId)) {
        seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== playerId);
      }
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
      if (club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS) return;
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
            <div style={{ ...display, fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              {userClub.name}
              {userClub.disqualified && (
                <span style={{ ...display, fontSize: 11, fontWeight: 700, background: PALETTE.crimson, color: "#fff", padding: "2px 8px", borderRadius: 5, letterSpacing: "0.04em" }}>
                  DISQUALIFIED — SIGN PLAYERS
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <TierBadge tierId={state.userTierId} /> {DIFFICULTY_MODES[state.difficulty]?.label ?? "Rookie"} · OVR {avgOvr} · ${userClub.budget.toLocaleString()}
              {DIFFICULTY_MODES[state.difficulty]?.wagesDeducted && (
                <button
                  onClick={() => setShowPayroll(true)}
                  style={{ background: "none", border: `1px solid ${PALETTE.parchment}55`, borderRadius: 5, padding: "2px 8px", color: PALETTE.parchment, fontSize: 11, cursor: "pointer", ...display }}
                >
                  Payroll
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
            Season {state.seasonNumber}<br />
            {seasonComplete ? "Season complete" : `Matchday ${currentMatchday}`}
          </div>
          {seasonComplete ? (() => {
            const userHasBracket = seasonPlayoffs && (
              (state.userTierId === 0 && seasonPlayoffs.mlsPlayoffResult) ||
              (state.userTierId === 1 && seasonPlayoffs.uslcPlayoffResult) ||
              seasonPlayoffs.promotionPlayoffs.some((pp) => pp.tierIdx === state.userTierId)
            );
            const userBracketTotalRounds = state.userTierId === 0 ? MLS_TOTAL_ROUNDS : state.userTierId === 1 ? USLC_TOTAL_ROUNDS : PROMO_TOTAL_ROUNDS;
            const readyToContinue = !seasonPlayoffs || !userHasBracket || revealedRounds >= userBracketTotalRounds;
            return (
              <button
                onClick={!seasonPlayoffs ? handleViewPostseason : readyToContinue ? doRollover : () => setTab("table")}
                style={{ ...display, fontWeight: 600, fontSize: 13, background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 16px", cursor: "pointer" }}
              >
                {!seasonPlayoffs ? "View Postseason" : readyToContinue ? "Continue to Next Season →" : "Finish watching your bracket →"}
              </button>
            );
          })() : (
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
        {tab === "squad" && <SquadTab club={userClub} matchday={currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1)} onToggleList={handleToggleList} onRenew={handleRenew} onSetCaptain={handleSetCaptain} tierId={state.userTierId} difficulty={state.difficulty} onToggleDP={handleToggleDP} onToggleRest={handleToggleRest} onToggleHoldBack={handleToggleHoldBack} onLoanOut={handleLoanOut} playersOnLoan={state.playersOnLoan} tier={tier} />}
        {tab === "tactics" && <TacticsTab club={userClub} matchday={currentMatchday ?? 1} onChange={handleTacticsChange} tier={tier} />}
        {tab === "table" && <TableTab tier={tier} userClubId={userClub.id} seasonPlayoffs={seasonPlayoffs} revealedRounds={revealedRounds} onSimRound={handleSimRound} onSimRest={handleSimRestOfPostseason} />}
        {tab === "fixtures" && <FixturesTab tier={tier} userClubId={userClub.id} usOpenCup={state.usOpenCup} />}
        {tab === "market" && <MarketTab tiers={state.tiers} userClub={userClub} userTierId={state.userTierId} onBuy={handleBuy} difficulty={state.difficulty} matchday={currentMatchday ?? 1} />}
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
        {tab === "opencup" && (
          <UsOpenCupTab
            usOpenCup={state.usOpenCup}
            pendingRoundIndex={pendingCupRoundIndex}
            onPlayRound={handlePlayCupRound}
            userClubId={state.userClubId}
          />
        )}
        {tab === "trophies" && <TrophyTab trophyLog={managerHistory.trophyLog} bestFinish={managerHistory.bestFinish} currentClubName={userClub.name} />}
      </div>

      {recap && <MatchdayRecap results={recap} userClubName={userClub.name} tier={tier} onClose={() => setRecap(null)} />}
      {cupRecap && <CupRecapModal recap={cupRecap} userClubId={state.userClubId} onClose={() => setCupRecap(null)} />}
      {rivalryRecap && <RivalryRecapModal recap={rivalryRecap} onClose={() => setRivalryRecap(null)} />}
      {windowNotice && <WindowNotice notice={windowNotice} onClose={() => setWindowNotice(null)} />}
      {renewalNotice && <RenewalNotice notice={renewalNotice} onClose={() => setRenewalNotice(null)} />}
      {infoNotice && <InfoNotice message={infoNotice} onClose={() => setInfoNotice(null)} />}
      <HintButton club={userClub} matchday={currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1)} tier={tier} managerHistory={managerHistory} setManagerHistory={setManagerHistory} />
      {sackedNotice && <SackedScreen notice={sackedNotice} onContinue={onSacked} />}
      {showPayroll && <PayrollOverlay club={userClub} difficulty={state.difficulty} tierIdx={state.userTierId} onClose={() => setShowPayroll(false)} />}
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
          userPayroll={rollover.userPayroll}
          mlsPlayoffResult={rollover.mlsPlayoffResult}
          userMlsPlayoff={rollover.userMlsPlayoff}
          uslcPlayoffResult={rollover.uslcPlayoffResult}
          userUslcPlayoff={rollover.userUslcPlayoff}
          userPromotionPlayoff={rollover.userPromotionPlayoff}
          boardNotice={rollover.boardNotice}
          userDpRevenue={rollover.userDpRevenue}
          usOpenCup={rollover.usOpenCup}
          userUsOpenCup={rollover.userUsOpenCup}
          seasonAwards={rollover.seasonAwards}
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

// Your trophy case is a MANAGER's history, not a specific club's — it
// survives being sacked or starting a new career, so it lives in its own
// storage key rather than inside the per-club save.
const MANAGER_KEY = "ascent_manager_history_v1";
const DEFAULT_MANAGER_HISTORY = { trophyLog: [], bestFinish: null, hasSeenTutorial: false, seenOneTimeHints: [] };

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
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [pendingCountry, setPendingCountry] = useState(null);
  const [showEnglandTest, setShowEnglandTest] = useState(false);
  const [managerHistory, setManagerHistory] = useState(DEFAULT_MANAGER_HISTORY);

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
    try {
      const rawHistory = localStorage.getItem(MANAGER_KEY);
      if (rawHistory) setManagerHistory({ ...DEFAULT_MANAGER_HISTORY, ...JSON.parse(rawHistory) });
    } catch (e) {
      // no manager history yet, or unreadable — fine, start with an empty case
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(MANAGER_KEY, JSON.stringify(managerHistory));
    } catch (e) {
      // best-effort
    }
  }, [managerHistory, loaded]);

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
    setPendingDifficulty(null);
    setPendingCountry(null);
    setShowEnglandTest(false);
  };

  // Getting sacked isn't the same as starting fresh — you keep your
  // difficulty mode and go straight to picking a new club, not back through
  // difficulty selection.
  const handleSacked = () => {
    const currentDifficulty = state?.difficulty;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setState(null);
    setPendingDifficulty(currentDifficulty || "rookie");
  };

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: PALETTE.pitchDark }} />;
  }

  // Show the tutorial before anything else for a brand-new manager — not
  // after they've already picked a difficulty and club. Skipped entirely
  // for anyone resuming an existing save.
  if (!managerHistory.hasSeenTutorial && !state) {
    return <OnboardingGuide onFinish={() => setManagerHistory((prev) => ({ ...prev, hasSeenTutorial: true }))} />;
  }

  if (!state) {
    if (!pendingCountry) {
      return <CountrySelectScreen onChoose={setPendingCountry} />;
    }
    if (pendingCountry === "england") {
      if (showEnglandTest) {
        return <EnglandTestScreen onBack={() => setShowEnglandTest(false)} />;
      }
      return <EnglandComingSoonScreen onBack={() => setPendingCountry(null)} onTryTestMode={() => setShowEnglandTest(true)} />;
    }
    if (!pendingDifficulty) {
      return <DifficultySelectScreen onChoose={setPendingDifficulty} onBack={() => setPendingCountry(null)} />;
    }
    const previewWorld = buildInitialWorld();
    previewWorld.forEach((t) => { t.fixtures = generateRoundRobin(t.clubs.map((c) => c.id)); });
    return <ClubSelectScreen world={previewWorld} saveWasReset={saveWasReset} difficulty={pendingDifficulty} onBack={() => setPendingDifficulty(null)} onPick={(tierId, clubId) => {
      // re-derive the same picked club/tier from a freshly built world containing it
      handlePickFromPreview(previewWorld, tierId, clubId, pendingDifficulty, setState);
    }} />;
  }

  return <Dashboard state={state} setState={setState} onNewGame={handleNewGame} onSacked={handleSacked} managerHistory={managerHistory} setManagerHistory={setManagerHistory} />;
}

function handlePickFromPreview(previewWorld, tierId, clubId, difficulty, setState) {
  let tiers = previewWorld;
  if (DIFFICULTY_MODES[difficulty]?.boardPressure) {
    const tierClubs = previewWorld[tierId].clubs;
    const pickedClub = tierClubs.find((c) => c.id === clubId);
    if (pickedClub) {
      const objective = generateBoardObjective(pickedClub.reputation, tierId, tierClubs);
      tiers = previewWorld.map((t, idx) => idx !== tierId ? t : {
        ...t,
        clubs: t.clubs.map((c) => c.id === clubId ? { ...c, boardObjective: objective, boardHappiness: c.boardHappiness ?? 60 } : c),
      });
    }
  }
  setState({
    saveVersion: SAVE_VERSION,
    difficulty,
    tiers,
    userTierId: tierId,
    userClubId: clubId,
    seasonNumber: 1,
    trophyLog: [],
    bestFinish: null,
    midWindowSeason: 0,
    prizePools: [3_000_000, 1_200_000, 500_000, 200_000],
    usOpenCup: null,
    usOpenCupQualifiers: null,
    playersOnLoan: [],
  });
}
