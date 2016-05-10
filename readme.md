#xmlvp2json

Permet de transformer un fichier xmlvp en json

##Install
```
$ npm install xmlvp2json
```
##Usage
```js
var xmlvp2json = require('xmlvp2json')
var jsonObject = xmlvp2json(data)
```
##Data
Voici un exemple pour le rendu d'une classe avec ses attributs et operations: 
```json
[
	{
		"attributes": [
			{
				"comment": "Le commentaire d'un attribut",
				"name": "nomDeAttribut",
				"type": "typeDeAttribut",
				"scope": "instance",
				"read_only": "false",
				"have_getter": "false",
				"have_setter": "false",
				"visibility": "private",
				"multiplicity": 1,
			}
		],
		"operations": [
			{
				"comment": "",
				"name": "uneOperation",
				"visibility": "public",
				"static": "false",
				"abstrac": "false",
				"scope": "instance",
				"parameters": [
					{
						"name": "premierParametreString",
						"comment": "c'est le premier paramètre",
						"type": "string",
                        "multiplicity": 1

					},
					{
						"name": "deuxiemeParametreBoolean",
						"comment": "Deuxième paramètre",
						"type": "boolean",
                        "multiplicity": 1,

					}
				],
				"return_type": "void - ou n'importe quel type",
				"return_comment": "commentaire du type de retour"
			}
		],
		"name": "NomDeLaClasse",
		"comment": "Desecription de la classe"
	}
]
```

##License
MIT