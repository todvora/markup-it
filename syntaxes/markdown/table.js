var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

// Create a table entity
function Table(header, align, rows) {
    return markup.BlockEntity(markup.BLOCKS.TABLE, ' ', markup.Entity.IMMUTABLE, {
        header: header,
        align: align,
        rows: rows
    });
}

// Detect alignement per column
function mapAlign(align) {
    return align.map(function(s) {
        if (/^ *-+: *$/.test(s)) {
            return 'right';
        } else if (/^ *:-+: *$/.test(s)) {
            return 'center';
        } else if (/^ *:-+ *$/.test(s)) {
            return 'left';
        } else {
            return null;
        }
    });
}

// SPlit rows into cells
function splitRows(rows) {
    return rows = rows.map(function(row) {
        return row
            .replace(/^ *\| *| *\| *$/g, '')
            .split(/ *\| */);
    });
}

var blockRule = markup.Rule(markup.BLOCKS.TABLE)

    // table no leading pipe (gfm)
    .regExp(reBlock.tables.nptable, function(match) {
        var header = match[1].replace(/^ *| *\| *$/g, '').split(/ *\| */);
        var align = match[2].replace(/^ *|\| *$/g, '').split(/ *\| */);
        var rows = match[3].replace(/\n$/, '').split('\n');

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

        return Table(header, align, rows);
    })

    // normal table
    .regExp(reBlock.tables.table, function(match) {
        var header =  match[1].replace(/^ *| *\| *$/g, '').split(/ *\| */);
        var align = match[2].replace(/^ *|\| *$/g, '').split(/ *\| */);
        var rows = match[3].replace(/(?: *\| *)?\n$/, '').split('\n').slice(0);

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

        return Table(header, align, rows);

    })

    // Output table as text
    .toText(function(inner, entity) {
        var result = '';



        return (result + '\n\n');
    });

module.exports = {
    block: blockRule
};
