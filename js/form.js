/**
 * Created by ajia on 2017/6/21.
 */
$(function(){
    var demo=$(".demoform").Validform({//demoform为绑定在form元素上的class
        btnSubmit:"#submit",//指定触发表单提交事件元素，如果表单下有submit按钮，该参数可以省略
        btnReset:".reset",//指定触发重置表单事件的元素,如果表单下有reset按钮，该参数可以省略
        tiptype:function(msg,o,cssctl){
            //o:{obj:*,type:*,curform:*},
            //obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
            //type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态,
            //curform为当前form对象;
            //cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
            if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                var objTip=o.obj.siblings(".Validform_checktip");
                cssctl(objTip,o.type);
                objTip.text(msg);
            }else{
                var objtip=o.obj.find("#msgdemo");
                cssctl(objtip,o.type);
                objtip.text(msg);
            }
        },//默认值为1，也可为2,3,4，function
                  // 1=> 自定义弹出框提示；
                  // 2=> 侧边提示(会在当前元素的父级的next对象的子级查找显示提示信息的对象，表单以ajax提交时会弹出自定义提示框显示表单提交状态)；
                 //  3=> 侧边提示(会在当前元素的siblings对象中查找显示提示信息的对象，表单以ajax提交时会弹出自定义提示框显示表单提交状态)；
                 //  4=> 侧边提示(会在当前元素的父级的next对象下查找显示提示信息的对象，表单以ajax提交时不显示表单的提交状态)；
                //2-4主要是定义提示框写在html中的位置
        ignoreHidden:false,//默认为false，为true时，对:hidden的表单不做验证（只有在：hidden表单绑定了datatype时才有意义，如果hidden的表单没有绑定datatype，即使ignoreHidden:false，也不做验证）
        dragonfly:false,//默认false，为true时，当表单值为空时不做校验（效果未验证成功）；
        tipSweep:false,//默认false，5.3+为true时提示信息只会在表单提交时触发显示，个表单blur时不触发信息提示；
        label:".label",//效果未验证成功
        showAllError:false,//默认false，提交表单时，一碰到验证不通过的对象就会停止检测后面的元素；为true时提交表单时所有错误信息都会显示，前提是tipetype值为2/3/4时，所有的错误信息都有地方显示；
        postonce:true,//默认false，关闭二次提交防御；为true时为开启状态，即在数据提交成功之后，表单将不能再继续提交；
        ajaxPost:true,//默认false,使用ajax方式提交表单数据，将会把数据POST到config方法或表单action属性里设定的地址；
        datatype:{
            "*6-20": /^[^\s]{6,20}$/,
            "z2-4" : /^[\u4E00-\u9FA5]{2,4}$/,
            "username":function(gets,obj,curform,regxp){
                //参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
                var reg1=/^[\w\.]{4,16}$/,
                    reg2=/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,8}$/;

                if(reg1.test(gets)){return true;}
                if(reg2.test(gets)){return true;}
                return false;

                //注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
            },
            "phone":function(){
                // 5.0 版本之后，要实现二选一的验证效果，datatype 的名称 不 需要以 "option_" 开头;
            }
        },
        usePlugin:{
            // swfupload:{},
            datepicker:{

                format:"yyyy-mm-dd",//指定输出的时间格式;
                firstDayOfWeek:1,//指定每周开始的日期，0、1-6 对应 周日、周一到周六;
                callback:function(date,obj){//指定选择日期后的回调函数;
                    //date:选中的日期;
                    //obj:当前表单元素;
                    $("#msgdemo2").text(date+" is selected");
                },
                //以上三个参数是在Validform插件内调用Datepicker时可传入的参数;
                //下面几个参数是Datepicker插件本身初始化时可接收的参数，还有更多请查看页面说明;
                clickInput:true,
                startDate:"1970-00-00",
                createButton:false
            }
        },
        beforeCheck:function(curform){
            //在表单提交执行验证之前执行的函数，curform参数是当前表单对象。
            //这里明确return false的话将不会继续执行验证操作;
        },
        beforeSubmit:function(curform){
            //在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
            //这里明确return false的话表单将不会提交;
        },
        callback:function(data){
            //返回数据data是json对象，{"info":"demo info","status":"y"}
            //info: 输出提示信息;
            //status: 返回提交数据的状态,是否提交成功。如可以用"y"表示提交成功，"n"表示提交失败，在ajax_post.php文件返回数据里自定字符，主要用在callback函数里根据该值执行相应的回调操作;
            //你也可以在ajax_post.php文件返回更多信息在这里获取，进行相应操作；
            //ajax遇到服务端错误时也会执行回调，这时的data是{ status:**, statusText:**, readyState:**, responseText:** }；

            //这里执行回调操作;
            //注意：如果不是ajax方式提交表单，传入callback，这时data参数是当前表单对象，回调函数会在表单验证全部通过后执行，然后判断是否提交表单，如果callback里明确return false，则表单不会提交，如果return true或没有return，则会提交表单。
        }
    });
    //validform 对象
    // ——1、对象1 tipmsg={// 默认提示文字，绑定tipmsg之后，表单上不需要再绑定errormsg
//     tit:"提示信息",
//         w:{
//         "*":"不能为空！",
//             "*6-16":"请填写6到16位任意字符！",
//             "n":"请填写数字！",
//             "n6-16":"请填写6到16位数字！",
//             "s":"不能输入特殊字符！",
//             "s6-18":"请填写6到18位字符！",
//             "p":"请填写邮政编码！",
//             "m":"请填写手机号码！",
//             "e":"邮箱地址格式不对！",
//             "url":"请填写网址！"
//     },
//     def:"请填写正确信息！",
//     undef:"datatype未定义！",
//     reck:"两次输入的内容不一致！",
//     r:"通过信息验证！",
//     c:"正在检测信息…",
//     s:"请{填写|选择}{0|信息}！",
//     v:"所填信息没有经过验证，请稍后…",
//     p:"正在提交数据…"
// };
    demo.tipmsg.w["*6-16"]="请填写6到16位数！";//用法；js里设置了tipmsg,html里表单上无需再绑定errormsg；
    demo.dataType={//--对象2 dataType
        // "match":/^(.+?)(\d+)-(\d+)$/,
        // "*":/[\w\W]+/,
        // "*6-16":/^[\w\W]{6,16}$/,
        // "n":/^\d+$/,
        // "n6-16":/^\d{6,16}$/,
        // "s":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,
        // "s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,
        // "p":/^[0-9]{6}$/,
        // "m":/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
        // "e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        // "url":/^(\w+:\/\/)?\w+(\.\w+)+.*$/
    };
    demo.addRule({ // 对象3 --addRule
        ele:"#name",//要绑定规则的对象
        datatype:"s6-18",
        ajaxurl:"valid.php",
        nullmsg:"请输入昵称！",
        errormsg:"昵称至少6个字符,最多18个字符！"
    })
    demo.abort();//--对象4 abort， 终止ajax提交
    demo.submitForm(false,"这里是url");//对象5 submitForm ，flag为true时，跳过验证直接提交。
    demo.resetForm();//对象6 重置表单
    demo.resetStatus();//对象7 充值表单的提交状态；传入了postonce参数的话，表单成功提交后状态会设置为"posted"，重置提交状态可以让表单继续可以提交。
    demo.getStatus();//迪欧想8 ；获取表单的提交状态，normal：未提交，posting：正在提交，posted：已成功提交过。
    demo.setStatus("这里是status");//对象9 设置表单的提交状态，可以设置normal，posting，posted三种状态，不传参则设置状态为posting，这个状态表单可以验证，但不能提交。
    demo.ignore("这里是selector");//对象10;忽略对所选择对象的验证，不传入selector则忽略所有表单元素。
    demo.unignore("这里是selector");//对象11 将ignore方法所忽略验证的对象重新获取验证效果，不传入selector则恢复验证所有表单元素。
    demo.check(false,"这里是selector");//对象12 bool为true时则只验证不显示提示信息
    demo.config("这里是setup");//对象13
});
