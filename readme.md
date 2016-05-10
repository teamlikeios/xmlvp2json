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
				"readOnly": "false",
				"hasGetter": "false",
				"hasSetter": "false",
				"visibility": "private"
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
						"type": "string"
					},
					{
						"name": "deuxiemeParametreBoolean",
						"comment": "Deuxième paramètre",
						"type": "boolean"
					}
				],
				"returnType": "void - ou n'importe quel type"
			}
		],
		"name": "NomDeLaClasse",
		"comment": "Desecription de la classe"
	}
]
```

##License
MIT