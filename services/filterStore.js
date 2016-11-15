/**
 * Created by fguebeli on 11.11.2016.
 */

function Filter(sorter,style,show,activElement){
    this.sorter = sorter;
    this.style = style;
    this.show = show;
    this.activElement = activElement;
}

function  publicSetConfig(req){
    var tempFilter = {};

    if(!req.session.filter){
        tempFilter = new Filter({},"white",'false',0);
    }else{
        tempFilter = req.session.filter;
    }

    if(req.query.order){
        tempFilter.sorter = req.query.order;
    }

    if(req.query.style){
        if(req.query.style == 'black'){
            tempFilter.style = 'black';
        }else{
            tempFilter.style = 'white';
        }
    }

    if(req.query.filter){
        if(req.query.filter == 'true'){
            tempFilter.show = 'true';
        }else{
            tempFilter.show = 'false';
        }
    }

    req.session.filter = tempFilter;

}

function  publicGetShow(req){
    if(req.session.filter.show == 'true'){
        return {finish: false};
    }
    return {};
}

function publicGetSorter(req){
    var temp = req.session.filter;
    var sorter = {};
    var activElement = 0;
    switch(temp.sorter){
        case 'fdate':
            sorter = {due: 1};
            activElement = 1;
            break;
        case 'rfdate':
            sorter = {due: -1};
            activElement = 1;
            break;
        case 'cdate':
            sorter = {create: 1};
            activElement = 2;
            break;
        case 'rcdate':
            sorter = {create: -1};
            activElement = 2;
            break;
        case 'importance':
            sorter = {prio: 1};
            activElement = 3;
            break;
        case 'rimportance':
            sorter = {prio: -1};
            activElement = 3;
            break;
    }
    req.session.filter.activElement = activElement;
    return sorter;
}

module.exports = {set : publicSetConfig, getShow : publicGetShow, getSorter : publicGetSorter};