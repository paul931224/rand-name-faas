goog.provide('reagent.debug');
goog.require('cljs.core');
reagent.debug.has_console = (typeof console !== 'undefined');
reagent.debug.tracking = false;
if((typeof reagent !== 'undefined') && (typeof reagent.debug !== 'undefined') && (typeof reagent.debug.warnings !== 'undefined')){
} else {
reagent.debug.warnings = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof reagent !== 'undefined') && (typeof reagent.debug !== 'undefined') && (typeof reagent.debug.track_console !== 'undefined')){
} else {
reagent.debug.track_console = (function (){var o = ({});
o.warn = ((function (o){
return (function() { 
var G__19860__delegate = function (args){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagent.debug.warnings,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"warn","warn",-436710552)], null),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,args)], 0));
};
var G__19860 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__19877__i = 0, G__19877__a = new Array(arguments.length -  0);
while (G__19877__i < G__19877__a.length) {G__19877__a[G__19877__i] = arguments[G__19877__i + 0]; ++G__19877__i;}
  args = new cljs.core.IndexedSeq(G__19877__a,0,null);
} 
return G__19860__delegate.call(this,args);};
G__19860.cljs$lang$maxFixedArity = 0;
G__19860.cljs$lang$applyTo = (function (arglist__19878){
var args = cljs.core.seq(arglist__19878);
return G__19860__delegate(args);
});
G__19860.cljs$core$IFn$_invoke$arity$variadic = G__19860__delegate;
return G__19860;
})()
;})(o))
;

o.error = ((function (o){
return (function() { 
var G__19884__delegate = function (args){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagent.debug.warnings,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"error","error",-978969032)], null),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,args)], 0));
};
var G__19884 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__19885__i = 0, G__19885__a = new Array(arguments.length -  0);
while (G__19885__i < G__19885__a.length) {G__19885__a[G__19885__i] = arguments[G__19885__i + 0]; ++G__19885__i;}
  args = new cljs.core.IndexedSeq(G__19885__a,0,null);
} 
return G__19884__delegate.call(this,args);};
G__19884.cljs$lang$maxFixedArity = 0;
G__19884.cljs$lang$applyTo = (function (arglist__19886){
var args = cljs.core.seq(arglist__19886);
return G__19884__delegate(args);
});
G__19884.cljs$core$IFn$_invoke$arity$variadic = G__19884__delegate;
return G__19884;
})()
;})(o))
;

return o;
})();
}
reagent.debug.track_warnings = (function reagent$debug$track_warnings(f){
reagent.debug.tracking = true;

cljs.core.reset_BANG_(reagent.debug.warnings,null);

(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));

var warns = cljs.core.deref(reagent.debug.warnings);
cljs.core.reset_BANG_(reagent.debug.warnings,null);

reagent.debug.tracking = false;

return warns;
});

//# sourceMappingURL=reagent.debug.js.map
