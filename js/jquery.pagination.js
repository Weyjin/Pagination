;(function($, window, document,undefined) {
   
    var Pagination = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
			color:'',
			background:'',
			showPage:5,//显示的页数
			defaultPage:1,//默认选中的页码
			totalPage:1,
			showPrev:true,
			showNext:true,
			showHome:true,
			showLast:true,
			showInfo:true,
			styles:['red','pink','purple','deep-purple','orange','green','grey','brown','cyan','teal'],
			result:function(index){}
        },
        this.options = $.extend({}, this.defaults, opt);
		this.init();
		return {}
    }
   
    Pagination.prototype = {
		//初始化
	    init:function(){
		  this.throwExcpetion();

		  var $arr=new Array();
		  $arr.push('<ul class="pagination '+this.options.color+'">');
		  if(this.options.showHome){
		  	$arr.push('<li class="home-page available '+this.options.color+'">首页</li>');
		  }
		  if(this.options.showPrev){
		  	$arr.push('<li class="previous previous-available '+this.options.color+'">&laquo;</li>');
		  }
          
          if(this.options.totalPage<this.options.showPage){
		     for(var i=0;i<this.options.totalPage;i++){		
				 if(this.options.defaultPage==(i+1)){
				 	$arr.push('<li class="item active '+this.options.background+'">'+(i+1)+'</li>');
				 }else{
				  $arr.push('<li class="item available '+this.options.color+'">'+(i+1)+'</li>');

				 }
		     }
		  }else{
		     for(var i=0;i<this.options.showPage;i++){	
				 if(this.options.defaultPage==(i+1)){
			     $arr.push('<li class="item active '+this.options.background+'">'+(i+1)+'</li>');
		         }else{
				 $arr.push('<li class="item available '+this.options.color+'">'+(i+1)+'</li>');

				 }
			 }
		  }
          
          if(this.options.showNext){
		  	$arr.push('<li class="next next-available '+this.options.color+'">&raquo;</li>');

		  }
		  if(this.options.showLast){
		  	$arr.push('<li class="last-page available '+this.options.color+'">末页</li>');
		  }
		  if(this.options.showInfo){
		  	 $arr.push('<li class="info">'+this.options.defaultPage+'/'+this.options.totalPage+'</li>');
		  }
		  $arr.push('</ul>');

		  this.$element.append($arr.join(''));
		  this.bindClick();
		   this.setDefaultPage(this.options.defaultPage);
		   this.options.result(this.options.defaultPage);
		},
		getBlocks:function(currentPage){
		   
			var offset=parseInt(parseInt(this.options.showPage)/2);
			var blocks=[];
			var overflow=false;
			if(parseInt(currentPage)<this.options.showPage){
			    for(var i=0;i<this.options.showPage;i++){				
				  blocks[i]=(i+1);			     
			   }
			}else{
			   for(var i=0;i<this.options.showPage;i++){				
				    blocks[i]=parseInt(currentPage)-offset+i;	
					if(parseInt(currentPage)-offset+i>=this.options.totalPage){
					    overflow=true;
						break;
					}
			   }
			}
			
		    if(overflow){
				blocks=this.getBottomBlocks(this.options.totalPage);
			}
			
			return blocks;
		},
		getBottomBlocks:function(total){
		    var blocks=[];
	        var j=0;
			for(var i=total;i>total-this.options.showPage;i--){
				   blocks[j]=i;
				   j++;
			}
			  var newBlocks=[];
			for(var i=0;i<this.options.showPage;i++){
			   newBlocks[i]=blocks[blocks.length-i-1];
			}
			  return newBlocks;
	    },
		updatePage:function(currentPage){
		    
			var blocks=this.getBlocks(currentPage);
			var that=this;
			that.unActiveAll();
		     this.$element.find('ul.pagination .item').each(function(index){
				     $(this).text(blocks[index]);

				     var text=$(this).text();
                     if(text==currentPage){
					 
					   $(this).removeClass('available');
					   $(this).removeClass(that.options.color);
					   $(this).addClass('active');
					   $(this).addClass(that.options.background);
					 }
			         
			 });
			 
		},
		bindClick:function(){
			var that=this;
            that.$element.find('ul.pagination').on('click','.item',function(e){
			      
				   if($(this).hasClass('active')){
				       return false;
				   }
				   var index=$(this).index('li.item');
			
				   that.unActiveAll();
							   
				   $(this).removeClass('available');
                   $(this).removeClass(that.options.color);
				   $(this).addClass('active');
                   $(this).addClass(that.options.background);

				   var currentPage=$(this).text();
				   that.options.result(parseInt(currentPage));
                   if((index+1)==that.options.showPage){
					   
				      if(currentPage!=that.options.totalPage){
				         that.updatePage(currentPage);
				       }	     
				     }else if(index==0){
				         that.updatePage(currentPage);
				    }else{
					   that.updatePage(parseInt(currentPage));
					}
					that.setPageNumber(currentPage);

					if(currentPage==1){
						if(that.options.totalPage!=1){
						 that.setDisabledHome();
					     that.setDisabledPrev();

					     that.setAvailableLast();
					     that.setAvailableNext();
						}
					  
				   }else if(currentPage==that.options.totalPage){
					   that.setDisabledLast();
					   that.setDisabledNext();

					   that.setAvailableHome();
					   that.setAvailablePrev();
				   }else{
					   that.setAvailableHome();
					   that.setAvailablePrev();
					   that.setAvailableLast();
					   that.setAvailableNext();
				   }
		   });

		   this.$element.find('ul.pagination .home-page').click(function(){
			   if(!$(this).hasClass('disabled')){
			       that.unActiveAll();
				   that.setDefaultPage(1);
				   that.updatePage(1);
				   that.setPageNumber(1);
			       that.options.result(1);
			   }
				   
			   
		  });
		   this.$element.find('ul.pagination .last-page').click(function(){
			   if(!$(this).hasClass('disabled')){
			   that.unActiveAll();
		       that.setDefaultPage(that.options.totalPage);
			   that.updatePage(that.options.totalPage);
			   that.setPageNumber(that.options.totalPage);
			   that.options.result(that.options.totalPage);
			   }
		  });
		  this.$element.find('ul.pagination .previous-available').click(function(){
			  if(!$(this).hasClass('disabled')){
		       var currentPage=that.getCurrentPage();
			   if(currentPage!=1){
			     that.prevActive(this);
				  that.options.result(currentPage-1);
			   }
			  }
		  });
          this.$element.find('ul.pagination .next-available').click(function(){
			  if(!$(this).hasClass('disabled')){
		       var currentPage=that.getCurrentPage();
			   if(currentPage!=that.options.totalPage){
			     that.nextActive();
				 that.options.result(currentPage+1);
			   }
			  }
		  });
		  

		},
		prevActive:function($this){
			var that=this;
			var $active=this.$element.find('ul.pagination .active');
            var index=$($active).text()-1;
            
			if(index>1){
			 
			  $($active).removeClass('active');
              $($active).removeClass(that.options.background);
			  $($active).addClass('available');
              $($active).addClass(that.options.color);

              $($active).prev().removeClass('available');
              $($active).prev().removeClass(that.options.color);
		      $($active).prev().addClass('active');
			  $($active).prev().addClass(that.options.background);
			  this.setPageNumber(index);
			  //激活末页
			  this.setAvailableLast();
			  this.setAvailableNext();
			}else if(index==1){
			 

              $($active).removeClass('active');
              $($active).removeClass(that.options.background);
			  $($active).addClass('available');
              $($active).addClass(that.options.color);

              $($active).prev().removeClass('available');
              $($active).prev().removeClass(that.options.color);
		      $($active).prev().addClass('active');
			  $($active).prev().addClass(that.options.background);

			  this.setPageNumber(index);
			  //禁用上一页          
			  //禁用首页
			  this.setDisabledHome();
			  this.setDisabledPrev();
			  
			}
			this.updatePage(index);
			
		},
		nextActive:function(){
		   var $active=this.$element.find('ul.pagination .active');
		   var that=this;
		   if(this.options.totalPage<=1) return;
            var index=parseInt($($active).text())+1;
			
               if(index==this.options.totalPage){
				
				  $($active).removeClass('active');
                  $($active).removeClass(that.options.background);
			      $($active).addClass('available');
                  $($active).addClass(that.options.color);


                  if(!$($active).next().hasClass('available')) return;

				 
                  $($active).removeClass('available');
                  $($active).removeClass(that.options.color);
			      $($active).addClass('active');
                  $($active).addClass(that.options.background);

  
                 
				  this.setPageNumber(index);
                  this.setDisabledLast();
				  this.setDisabledNext();
			   }else if(index<this.options.totalPage){
				 
                  $($active).removeClass('active');
                  $($active).removeClass(that.options.background);
			      $($active).addClass('available');
                  $($active).addClass(that.options.color);


				  if(!$($active).next().hasClass('available')) return;

				 
                  $($active).next().removeClass('available');
                  $($active).next().removeClass(that.options.color);
			      $($active).next().addClass('active');
                  $($active).next().addClass(that.options.background);

                  
				  this.setPageNumber(index);
			      this.setAvailableHome();
				  this.setAvailablePrev();
				  
			   }
		   this.updatePage(index);
         

		},
		//激活首页
		setAvailableHome:function(){
		  var $home=this.$element.find('.home-page');
		  $($home).removeClass('disabled');
          $($home).addClass('available');
          $($home).addClass(this.options.color);
		},
		//禁用首页
		setDisabledHome:function(){
		   var $home=this.$element.find('.home-page');
		    $($home).removeClass('available');
            $($home).removeClass(this.options.color);
            $($home).addClass('disabled');
		},
		//激活末页
		setAvailableLast:function(){
		   var $last=this.$element.find('.last-page');
           $($last).removeClass('disabled');
           $($last).addClass('available');
           $($last).addClass(this.options.color);
		},
		//禁用末页
		setDisabledLast:function(){
		   var $last=this.$element.find('.last-page');
           $($last).removeClass('available');
           $($last).removeClass(this.options.color);
           $($last).addClass('disabled');
		},
		//激活上一页
		setAvailablePrev:function(){	
		   var $prev=this.$element.find('.previous');
           $($prev).removeClass('disabled');
		   $($prev).addClass(this.options.color);
           $($prev).addClass('previous-available');
		},
		//禁用上一页
		setDisabledPrev:function(){
		   var $prev=this.$element.find('.previous');
           $($prev).removeClass('previous-available');
           $($prev).addClass('disabled');
		   $($prev).removeClass(this.options.color);
		},
		//激活下一页
        setAvailableNext:function(){
		   var $next=this.$element.find('.next');
           $($next).removeClass('disabled');
		   $($next).addClass(this.options.color);
           $($next).addClass('next-available');
		},
		//禁用下一页
		setDisabledNext:function(){
		   var $next=this.$element.find('.next');
           $($next).removeClass('next-available');
           $($next).addClass('disabled');
		   $($next).removeClass(this.options.color);
		},
		//设置页码
		setPageNumber:function(currentPage){
		    var $pNumber=this.$element.find('.info');
			var totalPage=this.options.totalPage;
            $($pNumber).text(currentPage+'/'+totalPage);
		
		},
		getCurrentPage:function(){
          var text=this.$element.find('ul.pagination .active').text();
		  return parseInt(text);
		},
		//设置默认页
		setDefaultPage:function(page){
			var that=this;
			
		   this.$element.find('ul.pagination .item').each(function(index){
               //如果总页数不等于1，则禁用首页的时候，激活末页
		       if(that.options.totalPage!=1){
			     if(page==1){
			     //首页
                 that.setDisabledHome();
				 that.setDisabledPrev();

                 that.setAvailableLast();
				 that.setAvailableNext();
			    }else if(page==that.options.totalPage){
			     //末页
                 that.setDisabledLast();
				 that.setDisabledNext();
                 
                 that.setAvailableHome();
				 that.setAvailablePrev();
			    }
			   
			   }else{
			     that.setDisabledHome();
				 that.setDisabledPrev();
				 that.setDisabledLast();
				 that.setDisabledNext();
			   }
		       
               if(page==(index+1)){
			     var $li=this;
				  
                  $($li).removeClass('available');
                  $($li).removeClass(that.options.color);
			      $($li).addClass('active');
                  $($li).addClass(that.options.background);
			   }


		   });
		},
		unActiveAll:function(){
			var that=this;
		  this.$element.find('ul.pagination li').each(function(index){
			    if($(this).hasClass('active')){
				   $(this).removeClass('active');
                    $(this).removeClass(that.options.background);
		           $(this).addClass('available');
                    $(this).addClass(that.options.color);
				}
		       
		  });
		},
		throwExcpetion:function(){
		  if(this.options.defaultPage<1||this.options.defaultPage>this.options.totalPage){
		     throw 'default page out of range';
		  }
		  if(this.options.showPage<=0){
		     throw 'show page out of range'
		  }
		}
	
    }
  $.fn.pagination = function(options) {
        
        var page = new Pagination(this, options);
        
        return page;
    }

})(jQuery, window, document);