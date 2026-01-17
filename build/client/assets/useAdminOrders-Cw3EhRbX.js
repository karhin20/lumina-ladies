import{c as r}from"./createLucideIcon-BDHzEgzW.js";import{u as o}from"./useQuery-DJWlbVla.js";import{u as s,a}from"./AuthContext-DV30UqFE.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=r("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]),m=()=>{const{sessionToken:e}=s();return o({queryKey:["admin-orders",e],enabled:!!e,queryFn:()=>a.adminOrders(e||""),retry:1})};export{d as A,m as u};
